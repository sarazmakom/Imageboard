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
        imgFile: "",
        currentImageId: location.hash.slice(1)
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
        },
        openModal: function(id) {
            this.currentImageId = id;
        },
        closeModal: function() {
            this.currentImageId = null;
            console.log("here", location.hash);
            location.hash = "";
        }
    },
    created: function(hash) {
        var me = this;
        addEventListener("hashchange", function() {
            console.log(location.hash);
            me.currentImageId = location.hash.slice(1);
        });
    },
    mounted: function() {
        var me = this;
        axios.get("/images").then(function(response) {
            me.images = response.data.images;
        });
    }
});

Vue.component("image-modal", {
    data: function() {
        return {
            currentImageId: {
                title: "",
                description: "",
                username: "",
                url: ""
            },
            comment: "",
            comments: [],
            commentInfo: {}
        };
    },
    props: ["id"],
    template: "#tmpl",
    methods: {
        close: function(e) {
            console.log("so");
            this.$emit("close", this.id, e.target.value);
        },
        commentSubmit: function() {
            var me = this;
            axios
                .post("/comments", {
                    comment: this.commentInfo.comment,
                    username: this.commentInfo.username,
                    image_id: this.id
                })
                .then(function(result) {
                    me.comments.unshift(result.data);
                })
                .catch(function(err) {
                    console.log(err);
                });
        }
    },
    mounted: function() {
        var me = this;
        axios.get("/image/" + this.id).then(function(result) {
            me.currentImageId = result.data;
        });
        axios.get("/comments/" + this.id).then(function(result) {
            me.comments = result.data;
        });
    }
});
