
const vm = new Vue({
    el: "#DrawIt",
    data() {
        return {
            textFilter: "",
            wordNumInput: "",
            wordSets: [],
            url: "https://docs.google.com/spreadsheets/d/e/2PACX-1vSj__epm1Cu0PF8OtCIvlFJ3V05d8Qew0QqHX-xPYnpK0XlqoNEPuon6llknJISqcihE4nPP5in8OER/pub?output=csv"
        }
    },
    computed: {
        words() {
            return this.wordSets.map(function(wordSet) {
                const full = wordSet[0];
                const subWords = full.split(' ');
                const wordData = subWords.map(function(subWord) {
                    return {
                        word: subWord,
                        len: subWord.lenght
                    }
                });
                return {
                    "full": full,
                    "wordData": wordData
                }
            });
        },
        wordNum() {
            const intNum = parseInt(this.wordNumInput)
            if (intNum) {
                return intNum;
            } else {
                return 0;
            }
        }
    },
    methods: {
        getList() {
            axios.get(this.url).then(data => this.wordSets = Papa.parse(data.data)['data'])
        }
    },
})