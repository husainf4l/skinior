import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import * as crypto from 'crypto';
import * as path from 'path';

@Injectable()
export class AwsService {
  private s3Client: S3Client;
  private bucketName: string;

  constructor(private configService: ConfigService) {
    const awsRegion = this.configService.get<string>('AWS_REGION');
    const awsAccessKeyId = this.configService.get<string>('AWS_ACCESS_KEY_ID');
    const awsSecretAccessKey = this.configService.get<string>('AWS_SECRET_ACCESS_KEY');
    const bucketName = this.configService.get<string>('AWS_BUCKET_NAME');

    if (!awsRegion || !awsAccessKeyId || !awsSecretAccessKey || !bucketName) {
      throw new Error('AWS configuration is missing. Please check your environment variables.');
    }

    this.s3Client = new S3Client({
      region: awsRegion,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    });
    this.bucketName = bucketName;
  }

  /**
   * Upload file to S3 and return the URL
   */
  async uploadFile(file: Express.Multer.File, folder: string = 'products'): Promise<string> {
    try {
      // Generate unique filename
      const fileExtension = path.extname(file.originalname);
      const fileName = `${crypto.randomUUID()}${fileExtension}`;
      const key = `${folder}/${fileName}`;

      // Validate file type
      if (!this.isValidImageType(file.mimetype)) {
        throw new BadRequestException('Only image files are allowed (JPEG, PNG, WebP, GIF)');
      }

      // Validate file size (10MB limit)
      if (file.size > 10 * 1024 * 1024) {
        throw new BadRequestException('File size must be less than 10MB');
      }

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
        ContentDisposition: 'inline',
        CacheControl: 'public, max-age=31536000', // 1 year cache
        Metadata: {
          originalName: file.originalname,
          uploadedAt: new Date().toISOString(),
        },
      });

      await this.s3Client.send(command);

      // Return the public URL
      return `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('AWS S3 Upload Error:', error);
      throw new InternalServerErrorException('Failed to upload file to AWS S3');
    }
  }

  /**
   * Upload multiple files to S3
   */
  async uploadMultipleFiles(files: Express.Multer.File[], folder: string = 'products'): Promise<string[]> {
    const uploadPromises = files.map(file => this.uploadFile(file, folder));
    return Promise.all(uploadPromises);
  }

  /**
   * Delete file from S3
   */
  async deleteFile(url: string): Promise<void> {
    try {
      const key = this.extractKeyFromUrl(url);
      
      const command = new DeleteObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      await this.s3Client.send(command);
    } catch (error) {
      console.error('AWS S3 Delete Error:', error);
      throw new InternalServerErrorException('Failed to delete file from AWS S3');
    }
  }

  /**
   * Delete multiple files from S3
   */
  async deleteMultipleFiles(urls: string[]): Promise<void> {
    const deletePromises = urls.map(url => this.deleteFile(url));
    await Promise.allSettled(deletePromises); // Continue even if some deletions fail
  }

  /**
   * Generate presigned URL for secure file access
   */
  async generatePresignedUrl(url: string, expiresIn: number = 3600): Promise<string> {
    try {
      const key = this.extractKeyFromUrl(url);
      
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: key,
      });

      return await getSignedUrl(this.s3Client, command, { expiresIn });
    } catch (error) {
      console.error('AWS S3 Presigned URL Error:', error);
      throw new InternalServerErrorException('Failed to generate presigned URL');
    }
  }

  /**
   * Generate presigned upload URL for client-side uploads
   */
  async generatePresignedUploadUrl(
    fileName: string, 
    contentType: string, 
    folder: string = 'products'
  ): Promise<{ uploadUrl: string; key: string; publicUrl: string }> {
    try {
      if (!this.isValidImageType(contentType)) {
        throw new BadRequestException('Only image files are allowed (JPEG, PNG, WebP, GIF)');
      }

      const fileExtension = path.extname(fileName);
      const uniqueFileName = `${crypto.randomUUID()}${fileExtension}`;
      const key = `${folder}/${uniqueFileName}`;

      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Key: key,
        ContentType: contentType,
        ContentDisposition: 'inline',
        CacheControl: 'public, max-age=31536000',
      });

      const uploadUrl = await getSignedUrl(this.s3Client, command, { expiresIn: 900 }); // 15 minutes
      const publicUrl = `https://${this.bucketName}.s3.${this.configService.get('AWS_REGION')}.amazonaws.com/${key}`;

      return {
        uploadUrl,
        key,
        publicUrl,
      };
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      console.error('AWS S3 Presigned Upload URL Error:', error);
      throw new InternalServerErrorException('Failed to generate presigned upload URL');
    }
  }

  /**
   * Extract S3 key from full URL
   */
  private extractKeyFromUrl(url: string): string {
    try {
      const urlObj = new URL(url);
      return urlObj.pathname.substring(1); // Remove leading '/'
    } catch (error) {
      throw new BadRequestException('Invalid S3 URL format');
    }
  }

  /**
   * Validate if the file type is an allowed image type
   */
  private isValidImageType(mimeType: string): boolean {
    const allowedTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
    ];
    return allowedTypes.includes(mimeType.toLowerCase());
  }

  /**
   * Optimize image settings for different use cases
   */
  getOptimizedUploadSettings(imageType: 'product' | 'brand' | 'category' | 'blog'): {
    folder: string;
    maxSize: number;
    cacheControl: string;
  } {
    const settings = {
      product: {
        folder: 'products',
        maxSize: 10 * 1024 * 1024, // 10MB
        cacheControl: 'public, max-age=31536000', // 1 year
      },
      brand: {
        folder: 'brands',
        maxSize: 5 * 1024 * 1024, // 5MB
        cacheControl: 'public, max-age=31536000', // 1 year
      },
      category: {
        folder: 'categories',
        maxSize: 5 * 1024 * 1024, // 5MB
        cacheControl: 'public, max-age=31536000', // 1 year
      },
      blog: {
        folder: 'blog',
        maxSize: 15 * 1024 * 1024, // 15MB
        cacheControl: 'public, max-age=2592000', // 30 days
      },
    };

    return settings[imageType];
  }
}