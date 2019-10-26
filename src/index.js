
const vm = new Vue({
    el: "#DrawIt",
    data() {
        return {
            test: 5,
            url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSj__epm1Cu0PF8OtCIvlFJ3V05d8Qew0QqHX-xPYnpK0XlqoNEPuon6llknJISqcihE4nPP5in8OER/pub?output=csv"
        }
    },
    methods: {
        getList() {
            axios.get(this.url).then(data=>console.log(data))
        }
    },
})