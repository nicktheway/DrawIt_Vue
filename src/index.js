function copyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
  
    //
    // *** This styling is an extra step which is likely not required. ***
    //
    // Why is it here? To ensure:
    // 1. the element is able to have focus and selection.
    // 2. if element was to flash render it has minimal visual impact.
    // 3. less flakyness with selection and copying which **might** occur if
    //    the textarea element is not visible.
    //
    // The likelihood is the element won't even render, not even a
    // flash, so some of these are just precautions. However in
    // Internet Explorer the element is visible whilst the popup
    // box asking the user for permission for the web page to
    // copy to the clipboard.
    //
  
    // Place in top-left corner of screen regardless of scroll position.
    textArea.style.position = 'fixed';
    textArea.style.top = 0;
    textArea.style.left = 0;
  
    // Ensure it has a small width and height. Setting to 1px / 1em
    // doesn't work as this gives a negative w/h on some browsers.
    textArea.style.width = '2em';
    textArea.style.height = '2em';
  
    // We don't need padding, reducing the size if it does flash render.
    textArea.style.padding = 0;
  
    // Clean up any borders.
    textArea.style.border = 'none';
    textArea.style.outline = 'none';
    textArea.style.boxShadow = 'none';
  
    // Avoid flash of white box if rendered for any reason.
    textArea.style.background = 'transparent';
  
  
    textArea.value = text;
  
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
  
    try {
        document.execCommand('copy');
    } catch (err) {
        console.log('Oops, unable to copy');
    }
  
    document.body.removeChild(textArea);
}

const vm = new Vue({
    el: "#DrawIt",
    data() {
        return {
            textFilter: "",
            wordNumInput: "",
            letterNumInput: "",
            wordSets: [],
            url: "https://cors-anywhere.herokuapp.com/https://docs.google.com/spreadsheets/d/e/2PACX-1vSj__epm1Cu0PF8OtCIvlFJ3V05d8Qew0QqHX-xPYnpK0XlqoNEPuon6llknJISqcihE4nPP5in8OER/pub?output=csv"
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
                        len: subWord.length
                    }
                });
                return {
                    "full": full,
                    "wordData": wordData
                }
            });
        },
        wordNum() {
            const intNum = parseInt(this.wordNumInput);
            if (intNum) {
                return intNum;
            }
            return 0;
        },
        letterNums() {
            const parsedArray = this.letterNumInput.match(/([0-9]+\+?)+/gm);
            if (parsedArray) {
                return parsedArray.map(val => ({'value': parseInt(val), 'greaterFlag': val.indexOf('+') !== -1}));
            }
            return [];
        },
        filteredWords() {
            return this.words.filter(word => word.full.startsWith(this.textFilter))
                            .filter(word => this.wordNum === 0 || word.wordData.length === this.wordNum)
                            .filter(word => {
                                if (!this.letterNums) return true;
                                if (this.letterNums.length > word.wordData.length) return false;
                                for (let i = 0; i < word.wordData.length; i++) {
                                    if (!this.letterNums[i]) return true;
                                    if (this.letterNums[i].greaterFlag && this.letterNums[i].value > word.wordData[i].len) return false;
                                    if (!this.letterNums[i].greaterFlag && this.letterNums[i].value !== word.wordData[i].len) return false;
                                }
                                return true;
                            })
        },
    },
    methods: {
        getList() {
            let promise = axios.get(this.url).then(data => this.wordSets = Papa.parse(data.data)['data']);
            return promise;
        },
        copyToClipboard(text, event) {
            copyTextToClipboard(text);
            event.currentTarget.style.color = "green";
        }
    },
    beforeMount() {
        // The list contains a header, so remove it:
        this.getList().then(() => this.wordSets.shift());
    },
})