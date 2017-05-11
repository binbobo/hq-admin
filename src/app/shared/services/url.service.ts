export class Urls {
    private static readonly debug: boolean = false;//process.env.ENV === "development";
    private static readonly base = 'http://api.sinoauto.com/';
    public static readonly localization = !Urls.debug ? Urls.base.concat('localization/') : "http://localhost:55820/api/";
    public static readonly configuration = !Urls.debug ? Urls.base.concat('zookeeper/') : "http://localhost:8012/api/";
    public static readonly logging = !Urls.debug ? Urls.base.concat('logger/') : 'http://localhost:8013/api/';
    public static readonly location = !Urls.debug ? Urls.base.concat('location/') : "http://localhost:8019/api/";
    public static readonly validate = !Urls.debug ? Urls.base.concat('validate/') : "http://localhost:8019/api/";
    public static readonly media = !Urls.debug ? Urls.base.concat('media/') : "http://api.sinoauto.com/media/";

    public static readonly platform = !Urls.debug ? Urls.base.concat('platform/') : Urls.base.concat('platform/');
    // public static readonly chain = !Urls.debug ? Urls.base.concat('chain') : "http://localhost:10239/api/";
    // public static readonly platform = !Urls.debug ? Urls.base.concat('platform/') : "http://localhost:22363/api/";


    public static readonly chain = !Urls.debug ? Urls.base.concat('chain') : "http://192.168.59.124:8028/api";

    // public static readonly chain = 'http://192.168.59.154:8028/api';
    // public static readonly chain = 'http://192.168.58.225/api';
}
