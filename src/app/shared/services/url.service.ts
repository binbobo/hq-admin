import { environment } from 'environments/environment';

export class Urls {
    private static readonly debug: boolean = !environment.production;
    private static readonly base = Urls.debug ? 'http://api.test.sinoauto.com/' : 'http://api.sinoauto.com/';
    public static readonly localization = Urls.base.concat('localization/');
    public static readonly configuration = Urls.base.concat('zookeeper/');
    public static readonly logging = Urls.base.concat('logger/');
    public static readonly location = Urls.base.concat('location/');
    public static readonly validate = Urls.base.concat('validate/');
    public static readonly media = Urls.base.concat('media/');
    public static readonly platform = Urls.base.concat('platform/');
    public static readonly chain = Urls.base.concat('chain');
}
