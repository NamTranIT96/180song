<template>
    <div>
        <div class="title-section">
            Select your favorite genres
        </div>

        <div class="list-music-genre">

            <div class="item-music-genre" :class="{'active': item.active}"
                 @click="changeStatus(item)"
                 v-for="(item,index) in list_music_genre"
                 :key="index">
                {{item.name}}
            </div>
        </div>

        <div class="title-section mt-10">
            Enjoy your never-listen-to songs
        </div>

        <div class="list-recommended-song" v-if="listGenreActive != ''" v-loading="loading_get_data">

            <div class="item-recommended-song" v-for="(item,index) in list_recommended_song" :key="index">
                <img :src="item.album.images[0].url">
                <div class="content">
                    {{item.name}}
                </div>

                <div class="button-control">

                    <el-button icon="el-icon-headset" @click="listenSong(item.uri)" type="success" size="mini"
                               circle></el-button>

                </div>

            </div>

        </div>

        <div v-else>
            Please choose your genre :D
        </div>

    </div>
</template>

<script>
    const axios = require('axios');
    import * as url from "url";

    url.URLSearchParams = URLSearchParams;
    export default {
        name: 'Home',
        data() {
            return {
                list_music_genre: [],
                token_info: {},
                list_recommended_song: [],
                loading_get_data: false
            }
        },

        computed: {
            // a computed getter
            listGenreActive: function () {
                var arr_genre_active = []

                this.list_music_genre.forEach(item => {
                    if (item.active) {
                        if (arr_genre_active.length < 5)
                            arr_genre_active.push(item.name)
                    }

                })

                if (arr_genre_active.length > 0) {
                    return arr_genre_active.join(',')
                }
                return ''
            }
        },

        watch: {
            // eslint-disable-next-line no-unused-vars
            listGenreActive(val) {
                this.getTrackByCategory()
            },
        },

        methods: {

            listenSong(url) {
                window.open(url)
            },

            changeStatus(item) {
                item.active = !item.active
                this.$forceUpdate()
            },
            getData() {
                var v = this

                var access_token = localStorage.getItem('access_token_180song')

                var token = 'Bearer ' + access_token

                axios.get('https://api.spotify.com/v1/recommendations/available-genre-seeds', {
                    headers: {Authorization: token}
                }).then(result => {
                    if (result.data.genres) {
                        let res = []
                        result.data.genres.forEach(item => {
                            let obj = {
                                name: item,
                                active: false
                            }
                            res.push(obj)
                        })
                        v.$set(v, 'list_music_genre', res)
                    }
                    // eslint-disable-next-line no-unused-vars
                }).catch((error => {
                    localStorage.removeItem('access_token_180song')

                    v.login()
                }))


                v.getTrackByCategory()

            },
            login() {

                var access_token = localStorage.getItem('access_token_180song')

                if (access_token == null) {
                    var my_client_id = '0d29de0cd00a48389701b9ec2fa89434'
                    var scopes = 'playlist-modify-public'
                    var redirect_uri = 'http://localhost:8080/'

                    window.location.href = 'https://accounts.spotify.com/authorize' +
                        '?response_type=code' +
                        '&client_id=' + my_client_id +
                        (scopes ? '&scope=' + encodeURIComponent(scopes) : '') +
                        '&redirect_uri=' + encodeURIComponent(redirect_uri)
                } else {
                    this.getData()
                }
            },
            checkData() {
                var v = this
                var url = new URL(window.location.href);

                var code = url.searchParams.get("code");

                if (code) {

                    var client_id = '0d29de0cd00a48389701b9ec2fa89434'
                    var client_secret = '3d178f1e3dc34fd9aaebe2712a6cced4'
                    var redirect_uri = 'http://localhost:8080/'
                    var encodedData = window.btoa(client_id + ':' + client_secret);
                    var authorization = 'Basic ' + encodedData;
                    const data = new URLSearchParams();
                    data.append("grant_type", "authorization_code");
                    data.append("redirect_uri", redirect_uri);
                    data.append("code", code);

                    fetch('https://accounts.spotify.com/api/token', {
                        method: 'POST',
                        headers: {
                            'Authorization': authorization,
                            'Content-Type': 'application/x-www-form-urlencoded'
                        },
                        body: data // Modified
                    }).then(r => r.json().then((data) => {
                            if (data) {
                                v.token_info = data
                                localStorage.setItem('access_token_180song', data.access_token)
                                v.getData()

                            }
                        })
                    )


                } else {
                    v.login()
                }
            },
            getTrackByCategory() {
                var v = this

                var access_token = localStorage.getItem('access_token_180song')

                if (access_token && v.listGenreActive != '') {
                    v.loading_get_data = true
                    var token = 'Bearer ' + access_token

                    var url = 'https://api.spotify.com/v1/recommendations?seed_genres='

                    var path = encodeURIComponent(v.listGenreActive)

                    var final_url = url + path

                    axios.get(final_url, {
                        headers: {Authorization: token}
                    }).then(result => {
                        v.loading_get_data = false
                        if (result.data.tracks) {
                            v.list_recommended_song = result.data.tracks
                        }
                        // eslint-disable-next-line no-unused-vars
                    }).catch((error => {
                        v.loading_get_data = false
                        localStorage.removeItem('access_token_180song')
                        v.login()
                    }))
                }


            }
        },
        mounted() {
            this.checkData()
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .mt-10 {
        margin-top: 10px;
    }

    .title-section {
        font-size: 16px;
        font-weight: bold;
        margin-bottom: 10px;
    }

    .list-music-genre {
        display: flex;
        flex-wrap: wrap;
        max-height: 30vh;
        overflow-y: scroll;
        border: 1px solid #fff;
        padding: 10px;
        border-radius: 10px;
    }

    .list-music-genre .item-music-genre {
        margin-right: 15px;
        margin-bottom: 10px;
        text-align: center;
        border: 1px solid #fff;
        border-radius: 10px;
        padding: 10px;
    }

    .list-music-genre .item-music-genre:hover {
        border-color: #96BF47 !important;
        cursor: pointer;
        color: #96BF47 !important;
    }

    .list-music-genre .item-music-genre.active {
        border-color: #96BF47 !important;
        color: #96BF47 !important;
    }

    .list-recommended-song {
        display: flex;
        flex-wrap: wrap;
    }

    .list-recommended-song .item-recommended-song {
        width: calc((100vw - 110px) / 6);
        border: 1px solid #ffff;
        border-radius: 10px;
        position: relative;
        margin-right: 10px;
        margin-bottom: 10px;
    }

    .list-recommended-song .item-recommended-song .button-control {
        position: absolute;
        top: 10px;
        right: 10px;
    }

    .list-recommended-song .item-recommended-song .content {
        padding: 0px 10px 5px 10px;
        font-size: 14px;
    }

    .list-recommended-song .item-recommended-song img {
        border-radius: 10px;
        border-bottom-left-radius: 0px;
        border-bottom-right-radius: 0px;
        width: 100%;
        opacity: 0.5;
    }


</style>
