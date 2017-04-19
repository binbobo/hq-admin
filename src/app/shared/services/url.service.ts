export class Urls {
    private static readonly debug: boolean = false;//process.env.ENV === "development";
    // private static readonly base = 'http://api.sinoauto.com/';
    private static readonly base = 'http://api.sinoauto.com/chain/';
    public static readonly localization = !Urls.debug ? Urls.base.concat('localization/') : "http://localhost:55820/api/";
    // public static readonly configuration = !Urls.debug ? Urls.base.concat('zookeeper/') : "http://localhost:8012/api/";
    public static readonly configuration = !Urls.debug ? Urls.base : "http://localhost:8012/api/";
    public static readonly logging = !Urls.debug ? Urls.base.concat('logger/') : 'http://localhost:8013/api/';
    public static readonly location = !Urls.debug ? Urls.base.concat('location/') : "http://localhost:8019/api/";
    public static readonly validate = !Urls.debug ? Urls.base.concat('validate/') : "http://localhost:8019/api/";
    public static readonly media = !Urls.debug ? Urls.base.concat('media/') : "http://api.sinoauto.com/media/";
    public static readonly platform = !Urls.debug ? Urls.base.concat('platform/') : Urls.base.concat('platform/');
}
