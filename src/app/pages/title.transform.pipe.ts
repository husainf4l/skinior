import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'titleTransform',
    standalone: true
})
export class TitleTransformPime implements PipeTransform {
    transform(value: any, ...args: any[]) {
        console.log('value', value);
        if (value === 'shoulderbags') {
            return 'Shoulder Bags'
        } else if (value = 'designerbags') {
            return "Designer Bags"
        }
        return;
    }
}
