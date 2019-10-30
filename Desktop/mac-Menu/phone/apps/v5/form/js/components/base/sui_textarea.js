/**
 * Created by yangchao on 2016/5/27.
 */

(function ($, Vue, doc) {
    'use strict';

    var sui_textarea = Vue.extend({
        props: ['scope'],
        template:   '<div class="mui-input-row">' +
        '<label>{{scope.fieldInfo.display}}</label>' +
        '<textarea type="text" v-model="scope.model.value"></textarea>' +
        '</div>'

    });

    Vue.component('sui-textarea', sui_textarea);
})(cmp, Vue, document);

