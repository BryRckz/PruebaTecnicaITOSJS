(function ($) {
    'use strict';
    $.fn.autocompleter = function (options) {
        var settings = {
            url_list: '',
            url_get:  ''
        };
        return this.each(function () {
            if (options) {
                $.extend(settings, options);
            }
            var $this = $(this), $fakeInput = $('<input type="text" id="fake'+$this.attr('id')+'" name="fake' + $this.attr('name') + '" class="form-control">');
            $this.hide().after($fakeInput);
            $fakeInput.autocomplete({
                source: function (request, response) {
                    $.get(settings.url_list,{term: request.term}).done(function(result){
                        var jsonResult = JSON.parse(result);
                        var term = $.ui.autocomplete.escapeRegex(request.term)
                        , startsWithMatcher = new RegExp("^" + term, "i")
                        , startsWith = $.grep(jsonResult, function(value) {
                            return startsWithMatcher.test(value.label || value.value || value);
                        })
                        , containsMatcher = new RegExp(term, "i")
                        , contains = $.grep(jsonResult, function (value) {
                            return $.inArray(value, startsWith) < 0 &&
                                containsMatcher.test(value.label || value.value || value);
                        });

                        response(startsWith.concat(contains));
                    });
                    
                },
                appendTo: "#myModal",
                delay: 500,
                minLength: 3,
                select: function (event, ui) {
                    $this.val(ui.item.id);
                }
            });
            if ($this.val() !== '') {
                $.ajax({
                    url:     settings.url_get + $this.val(),
                    success: function (name) {
                        $fakeInput.val(name);
                    }
                });
            }
        });
    };
})(jQuery);
