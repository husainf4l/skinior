import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:go_router/go_router.dart';
import 'package:cached_network_image/cached_network_image.dart';
import '../../providers/products_provider.dart';
import '../../providers/cart_provider.dart';
import '../../providers/favorites_provider.dart';
import '../../models/product_models.dart';

class ProductDetailScreen extends StatefulWidget {
  final String productId;
  
  const ProductDetailScreen({
    super.key,
    required this.productId,
  });

  @override
  State<ProductDetailScreen> createState() => _ProductDetailScreenState();
}

class _ProductDetailScreenState extends State<ProductDetailScreen> {
  Product? _product;
  bool _isLoading = true;
  int _selectedQuantity = 1;

  @override
  void initState() {
    super.initState();
    _loadProduct();
  }

  Future<void> _loadProduct() async {
    setState(() {
      _isLoading = true;
    });

    try {
      final productsProvider = Provider.of<ProductsProvider>(context, listen: false);
      _product = await productsProvider.getProductById(widget.productId);
    } catch (e) {
      debugPrint('Error loading product: $e');
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return Scaffold(
        appBar: AppBar(),
        body: const Center(child: CircularProgressIndicator()),
      );
    }

    if (_product == null) {
      return Scaffold(
        appBar: AppBar(
          title: const Text('Product Not Found'),
        ),
        body: const Center(
          child: Text('Product not found'),
        ),
      );
    }

    return Scaffold(
      body: CustomScrollView(
        slivers: [
          _buildSliverAppBar(),
          SliverToBoxAdapter(
            child: Column(
              children: [
                _buildProductInfo(),
                _buildProductDescription(),
                _buildIngredients(),
                _buildSkinTypeCompatibility(),
                _buildReviews(),
                _buildRelatedProducts(),
                const SizedBox(height: 100), // Space for bottom bar
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: _buildBottomBar(),
    );
  }

  Widget _buildSliverAppBar() {
    final images = _product!.imageUrl != null 
        ? [_product!.imageUrl!] 
        : <String>[];

    return SliverAppBar(
      expandedHeight: 400,
      pinned: true,
      actions: [
        Consumer<FavoritesProvider>(
          builder: (context, favoritesProvider, _) {
            return IconButton(
              icon: Icon(
                favoritesProvider.isFavorite(_product!.id)
                    ? Icons.favorite
                    : Icons.favorite_border,
                color: Colors.red,
              ),
              onPressed: () {
                favoritesProvider.toggleFavorite(_product!);
              },
            );
          },
        ),
        IconButton(
          icon: const Icon(Icons.share),
          onPressed: () {
            // Implement share functionality
          },
        ),
      ],
      flexibleSpace: FlexibleSpaceBar(
        background: images.isNotEmpty
            ? PageView.builder(
                itemCount: images.length,
                onPageChanged: (index) {},
                itemBuilder: (context, index) {
                  return CachedNetworkImage(
                    imageUrl: images[index],
                    fit: BoxFit.cover,
                    placeholder: (context, url) => Container(
                      color: Colors.grey[200],
                      child: const Center(child: CircularProgressIndicator()),
                    ),
                    errorWidget: (context, url, error) => Container(
                      color: Colors.grey[200],
                      child: const Icon(Icons.image_not_supported, size: 64),
                    ),
                  );
                },
              )
            : Container(
                color: Colors.grey[200],
                child: const Icon(Icons.image_not_supported, size: 64),
              ),
      ),
    );
  }

  Widget _buildProductInfo() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Brand
          if (_product!.brand != null) ...[
            Text(
              _product!.brand!,
              style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                color: Theme.of(context).colorScheme.primary,
                fontWeight: FontWeight.w600,
              ),
            ),
            const SizedBox(height: 4),
          ],
          
          // Product Name
          Text(
            _product!.name,
            style: Theme.of(context).textTheme.headlineMedium?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          
          // Rating and Reviews
          if (_product!.rating != null) ...[
            Row(
              children: [
                Row(
                  children: List.generate(5, (index) {
                    return Icon(
                      index < (_product!.rating ?? 0).round()
                          ? Icons.star
                          : Icons.star_border,
                      color: Colors.amber,
                      size: 20,
                    );
                  }),
                ),
                const SizedBox(width: 8),
                Text(
                  _product!.rating!.toStringAsFixed(1),
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                if (_product!.reviewCount != null) ...[
                  const SizedBox(width: 4),
                  Text(
                    '(${_product!.reviewCount} reviews)',
                    style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                      color: Colors.grey[600],
                    ),
                  ),
                ],
              ],
            ),
            const SizedBox(height: 16),
          ],
          
          // Price
          Text(
            '\$${_product!.price.toStringAsFixed(2)}',
            style: Theme.of(context).textTheme.headlineLarge?.copyWith(
              color: Theme.of(context).colorScheme.primary,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          
          // Stock Status
          Row(
            children: [
              Icon(
                _product!.inStock ? Icons.check_circle : Icons.cancel,
                color: _product!.inStock ? Colors.green : Colors.red,
                size: 20,
              ),
              const SizedBox(width: 4),
              Text(
                _product!.inStock ? 'In Stock' : 'Out of Stock',
                style: TextStyle(
                  color: _product!.inStock ? Colors.green : Colors.red,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
          
          // Quantity Selector
          if (_product!.inStock) ...[
            const SizedBox(height: 16),
            Row(
              children: [
                Text(
                  'Quantity:',
                  style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(width: 16),
                Container(
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.grey[300]!),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        onPressed: _selectedQuantity > 1 ? () {
                          setState(() {
                            _selectedQuantity--;
                          });
                        } : null,
                        icon: const Icon(Icons.remove),
                      ),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 16),
                        child: Text(
                          '$_selectedQuantity',
                          style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                      ),
                      IconButton(
                        onPressed: () {
                          setState(() {
                            _selectedQuantity++;
                          });
                        },
                        icon: const Icon(Icons.add),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildProductDescription() {
    if (_product!.description == null) return const SizedBox.shrink();

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Description',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            _product!.description!,
            style: Theme.of(context).textTheme.bodyLarge,
          ),
        ],
      ),
    );
  }

  Widget _buildIngredients() {
    if (_product!.ingredients == null || _product!.ingredients!.isEmpty) {
      return const SizedBox.shrink();
    }

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Key Ingredients',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _product!.ingredients!.map((ingredient) {
              return Chip(
                label: Text(ingredient),
                backgroundColor: Theme.of(context).colorScheme.primary.withValues(alpha: 0.1),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildSkinTypeCompatibility() {
    if (_product!.skinTypes == null || _product!.skinTypes!.isEmpty) {
      return const SizedBox.shrink();
    }

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Suitable for Skin Types',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 8),
          Wrap(
            spacing: 8,
            runSpacing: 8,
            children: _product!.skinTypes!.map((skinType) {
              return Chip(
                label: Text(skinType),
                backgroundColor: Colors.green.withValues(alpha: 0.1),
                avatar: const Icon(Icons.check, color: Colors.green, size: 16),
              );
            }).toList(),
          ),
        ],
      ),
    );
  }

  Widget _buildReviews() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Reviews',
                style: Theme.of(context).textTheme.titleLarge?.copyWith(
                  fontWeight: FontWeight.bold,
                ),
              ),
              TextButton(
                onPressed: () {
                  // Navigate to all reviews
                },
                child: const Text('See All'),
              ),
            ],
          ),
          const SizedBox(height: 16),
          
          // Sample Reviews (you can replace with real data)
          _buildReviewItem(
            'Sarah M.',
            5,
            'Amazing product! My skin feels so much better after using this.',
            '2 days ago',
          ),
          const SizedBox(height: 12),
          _buildReviewItem(
            'John D.',
            4,
            'Good quality, would recommend to others.',
            '1 week ago',
          ),
          const SizedBox(height: 12),
          _buildReviewItem(
            'Emily R.',
            5,
            'Perfect for my sensitive skin. Will definitely buy again!',
            '2 weeks ago',
          ),
        ],
      ),
    );
  }

  Widget _buildReviewItem(String name, int rating, String comment, String timeAgo) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.grey[50],
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              CircleAvatar(
                radius: 16,
                backgroundColor: Theme.of(context).colorScheme.primary,
                child: Text(
                  name[0],
                  style: const TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Text(
                          name,
                          style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const Spacer(),
                        Text(
                          timeAgo,
                          style: Theme.of(context).textTheme.bodySmall?.copyWith(
                            color: Colors.grey[600],
                          ),
                        ),
                      ],
                    ),
                    Row(
                      children: List.generate(5, (index) {
                        return Icon(
                          index < rating ? Icons.star : Icons.star_border,
                          color: Colors.amber,
                          size: 16,
                        );
                      }),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),
          Text(
            comment,
            style: Theme.of(context).textTheme.bodyMedium,
          ),
        ],
      ),
    );
  }

  Widget _buildRelatedProducts() {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Related Products',
            style: Theme.of(context).textTheme.titleLarge?.copyWith(
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 16),
          
          // Related products would be loaded from API
          SizedBox(
            height: 200,
            child: Center(
              child: Text(
                'Related products coming soon...',
                style: Theme.of(context).textTheme.bodyLarge?.copyWith(
                  color: Colors.grey[600],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomBar() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.1),
            blurRadius: 10,
            offset: const Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        child: Row(
          children: [
            // Add to Cart Button
            Expanded(
              flex: 2,
              child: Consumer<CartProvider>(
                builder: (context, cartProvider, _) {
                  return ElevatedButton.icon(
                    onPressed: _product!.inStock ? () {
                      cartProvider.addItem(_product!, quantity: _selectedQuantity);
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('${_product!.name} added to cart'),
                          duration: const Duration(seconds: 2),
                          action: SnackBarAction(
                            label: 'View Cart',
                            onPressed: () => context.go('/cart'),
                          ),
                        ),
                      );
                    } : null,
                    icon: const Icon(Icons.add_shopping_cart),
                    label: Text(_product!.inStock ? 'Add to Cart' : 'Out of Stock'),
                    style: ElevatedButton.styleFrom(
                      backgroundColor: Theme.of(context).colorScheme.primary,
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                    ),
                  );
                },
              ),
            ),
            const SizedBox(width: 12),
            
            // Buy Now Button
            Expanded(
              child: OutlinedButton(
                onPressed: _product!.inStock ? () {
                  // Add to cart and go to checkout
                  final cartProvider = Provider.of<CartProvider>(context, listen: false);
                  cartProvider.addItem(_product!, quantity: _selectedQuantity);
                  context.go('/checkout');
                } : null,
                style: OutlinedButton.styleFrom(
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                child: const Text('Buy Now'),
              ),
            ),
          ],
        ),
      ),
    );
  }
}