Vue.component('search-result', {
    props: {"title": String, "price": Number, "grading": Number},
    computed: {
        gradingClass: function() {
            return "ad-grading star-" + this.grading;
        },
        prettyPrice: function() {
            return this.price.toFixed(2);
        }
    },
    methods: {
        
    },
    template: `
    <div class="ad-info">
        <div class="ad-title">{{ title }}</div>
        <div class="ad-price">Prezzo: {{ prettyPrice }}€/ora</div>
        <div v-bind:class="gradingClass">
            <div class="star" v-for="_ in 5"></div>
        </div>
    </div>
    `
});

let vueApp = new Vue({
    el: '#app',
    data: {
        searchterms: "",
        ads: [
            { title: "Analisi I", price: 10.50, grading: 1 },
            { title: "Ingegneria del Software I", price: 0, grading: 5},
            { title: "Ingegneria del Software I", price: 0, grading: 5},
            { title: "Ingegneria del Software I", price: 0, grading: 5},
            { title: "Ingegneria del Software I", price: 0, grading: 5},
            { title: "Ingegneria del Software I", price: 0, grading: 5},
            { title: "Ingegneria del Software I", price: 0, grading: 5}
        ]
    },
    methods: {
        submitSearch: function() {
            
        },
        navigateTo: function(ev) {
            let realTarget = (ev.target.localName == "span" ? ev.target.parentElement : ev.target);
            document.querySelector(".current").classList.remove("current");
            realTarget.classList.add("current");
            return true;
        }
    }
})