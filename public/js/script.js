new Vue({
    el: "#main",
    data: {
        imgFormInfo: {
            title: "",
            description: "",
            username: "",
            img: null
        },
        images: [],
        imgFile: ""
    },
    methods: {
        selectFile: function(e) {
            this.imgFormInfo.img = e.target.files[0];
        },
        uploadImage: function(e) {
            e.preventDefault();
            var me = this;
            var fd = new FormData();
            fd.append("title", this.imgFormInfo.title);
            fd.append("description", this.imgFormInfo.description);
            fd.append("username", this.imgFormInfo.username);
            fd.append("file", this.imgFormInfo.img);

            axios.post("/upload", fd).then(function(result) {
                me.images.unshift(result.data);
            });
        }
    },
    mounted: function() {
        var me = this;
        axios.get("/images").then(function(response) {
            me.images = response.data.images;
        });
    }
});
