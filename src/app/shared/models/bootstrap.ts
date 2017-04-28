import { element } from 'protractor';
export class HQHelper {
    public static fetch(source, dest) {
        for (var key in source) {
            if (dest.hasOwnProperty(key)) {
                var element = source[key];
                if (element !== undefined) {
                    dest[key] = element;
                }
            }
        }
    }
}