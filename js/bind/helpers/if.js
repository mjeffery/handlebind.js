define(['lib/handlebars', 'context/BindingContext', 'bind/context'], function(Handlebars, BindingContext, context) {

    Handlebars.helpers['_nobind_if'] = Handlebars.helpers['if'];
    Handlebars.registerHelper('if', function(target, options) {

        var ret = "",
            self= this,
            ifContext1 = BindingContext.extend({
                renderContent: function(value) {
                    var result = "";
                    if(!value || Handlebars.Utils.isEmpty(value))
                        result = options.inverse(self);
                    else
                        result = options.fn(self);

                    return new Handlebars.SafeString(result);
                }
            }),
            ifContext = ifContext1.invoke({
                target: target,
                parent: context(),
                bind: !(options.hash['unbound'] === true)
            });

        context(ifContext);
        ret = ifContext.render();
        context.pop();

        return ret;
    });
});