<template>
    <div style="padding: 20px" v-loading="loading_main">
        <div class="title-wrapper">
            <div class="title-section">
                Select your favorite genres
            </div>
            <div>
                <el-button type="success" icon="el-icon-close" size="mini" round @click="clearAllGenres()">Clear all
                    genre
                </el-button>
            </div>
        </div>

        <div class="list-music-genre">
            <div class="item-music-genre" :class="{'active': item.active}"
                 @click="changeStatus(item)"
                 v-for="(item,index) in list_music_genre"
                 :key="index">
                {{item.name}}
            </div>
        </div>

        <div class="title-wrapper">
            <div class="title-section mt-20">
                Enjoy your never-listen-to songs
            </div>
            <div style="display: flex; align-items: center" v-if="listGenreDeactive != ''">
                <el-button type="success" icon="el-icon-plus" size="mini" round @click="createPlayList()">
                    Create Play List
                </el-button>
            </div>
        </div>


        <div v-if="listGenreDeactive != ''">

            <div class="list-recommended-song" v-loading="loading_get_data">
                <div class="item-recommended-song" v-for="(item,index) in list_recommended_song" :key="index">
                    <img :src="item.album.images[0].url">
                    <div class="content">
                        {{item.name}}
                    </div>

                    <div class="button-control">
                        <el-button icon="el-icon-headset" @click="listenSong(item.uri)" type="success" size="mini"
                                   circle>
                        </el-button>
                    </div>

                </div>
            </div>

            <div class="mt-20" style="text-align: center">
                <el-button type="success" round @click="viewMoreSong()">View more</el-button>
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

    import RETURN_URL from "./base_urls"

    url.URLSearchParams = URLSearchParams;
    export default {
        name: 'Home',
        data() {
            return {
                list_music_genre: [],
                token_info: {},
                list_recommended_song: [],
                loading_get_data: false,
                pagination: 0,

                info_user: {},

                loading_main: false
            }
        },

        computed: {
            // a computed getter
            listGenreDeactive: function () {
                var arr_genre_active = []

                var check_have_active = false

                this.list_music_genre.forEach(item => {
                    if (!item.active) {
                        arr_genre_active.push(item.name)
                    } else {
                        check_have_active = true
                    }

                })

                if (!check_have_active)
                    return []
                else
                    return arr_genre_active
            },
            listGenreActive: function () {
                var arr_genre_active = []

                this.list_music_genre.forEach(item => {
                    if (item.active) {
                        arr_genre_active.push(item.name)
                    }
                })

                return arr_genre_active.join(' + ')
            }
        },

        watch: {
            // eslint-disable-next-line no-unused-vars
            listGenreDeactive(val) {
                this.getTrackByCategory()
            },
        },

        methods: {

            createPlayList() {
                var v = this

                var access_token = localStorage.getItem('access_token_180song')

                var token = 'Bearer ' + access_token

                var url = `https://api.spotify.com/v1/users/${v.info_user.id}/playlists`

                var to_date = new Date()

                var data = {
                    name: 'Play list 180 degree different with genres: ' + v.listGenreActive + ' ' + to_date.toLocaleDateString(),
                    description: 'Play list 180 degree different with genres:  ' + v.listGenreActive + ' ' + to_date.toLocaleDateString(),
                    public: true
                }

                v.loading_main = true

                axios.post(url, JSON.stringify(data), {
                    headers: {Authorization: token}
                }).then(result => {
                    if (result.data) {
                        v.addSongToPlayList(result.data)
                    }
                    // eslint-disable-next-line no-unused-vars
                }).catch((error => {
                    v.loading_main = false
                    localStorage.removeItem('access_token_180song')
                    v.login()
                }))
            },

            addSongToPlayList(item_play_list) {
                var v = this

                var access_token = localStorage.getItem('access_token_180song')

                var token = 'Bearer ' + access_token

                var url = `https://api.spotify.com/v1/playlists/${item_play_list.id}/tracks?uris=`

                var array_uri_song = []

                v.list_recommended_song.forEach(item => {
                    if (item.uri)
                        array_uri_song.push(encodeURIComponent(item.uri))
                })

                var str_array_uri = array_uri_song.join(',')

                var final_url = url + str_array_uri


                axios.post(final_url, {}, {
                    headers: {
                        Authorization: token,
                        Accept: 'application/json'
                    }
                }).then(result => {
                    if (result.data) {
                        v.$notify({
                            title: 'Success',
                            message: 'Add play list successfully',
                            type: 'success'
                        });
                        window.location.href = item_play_list.uri
                    }
                    v.loading_main = false
                    // eslint-disable-next-line no-unused-vars
                }).catch((error => {
                    v.loading_main = false
                    localStorage.removeItem('access_token_180song')
                    // v.login()
                }))
            },

            viewMoreSong() {
                this.pagination += 1
                this.getTrackByCategory(true)
            },

            clearAllGenres() {
                this.list_music_genre.forEach(item => {
                    item.active = false
                })
            },

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

                v.getInfoUser()

                v.getTrackByCategory()

            },
            getInfoUser() {
                var v = this

                var access_token = localStorage.getItem('access_token_180song')

                var token = 'Bearer ' + access_token

                axios.get('https://api.spotify.com/v1/me', {
                    headers: {Authorization: token}
                }).then(result => {
                    if (result.data) {
                        v.$set(v, 'info_user', result.data)
                    }
                    // eslint-disable-next-line no-unused-vars
                }).catch((error => {
                    localStorage.removeItem('access_token_180song')
                    v.login()
                }))
            },
            login() {

                var access_token = localStorage.getItem('access_token_180song')

                if (access_token == null) {
                    var my_client_id = '0d29de0cd00a48389701b9ec2fa89434'
                    var scopes = 'playlist-modify-public'
                    var redirect_uri = RETURN_URL

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
                    var redirect_uri = RETURN_URL
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
            getTrackByCategory(is_view_more = false) {
                var v = this

                var access_token = localStorage.getItem('access_token_180song')

                if (access_token && v.listGenreDeactive.length > 0) {
                    v.loading_get_data = true
                    var token = 'Bearer ' + access_token

                    var url = 'https://api.spotify.com/v1/recommendations?seed_genres='

                    let promises = []

                    let listGenreDeactiveSlice = v.listGenreDeactive.slice(v.pagination * 18, v.pagination * 18 + 18)

                    listGenreDeactiveSlice.forEach(item => {
                        let path = encodeURIComponent(item)

                        let final_url = url + path

                        promises.push(
                            axios.get(final_url, {
                                headers: {Authorization: token}
                            })
                        )
                    })


                    Promise.all(promises).then(function (results) {

                        if (!is_view_more)
                            v.list_recommended_song = []

                        results.forEach(item => {
                            v.list_recommended_song.push(item.data.tracks[0])
                        })

                        v.loading_get_data = false
                    });
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

    .title-wrapper {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-content: center;
    }

    .mt-20 {
        margin-top: 20px;
    }

    .title-section {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
        color: #96BF47;
    }

    .list-music-genre {
        display: flex;
        flex-wrap: wrap;
        max-height: 25vh;
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
        width: calc((100vw - 146px) / 6);
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
        height: 220px;
        object-fit: cover;
    }


</style>
