<template>
    <div>
        <div class="auth-wrapper auth-v1 px-2">
            <div class="auth-inner py-2">
                <div class="card mb-0">
                    <div class="card-body">
                        <div style="text-align: center; margin-top: 20px;">
                            <a href="#" target="_self" class="brand-logo">
                                <img style="height: 60px;" src="../assets/bps.svg">
                            </a>
                        </div>
                        <h4 class="card-title mb-1" style="color:#5e5873; margin-bottom: 5px; text-align: center;"> Welcome to Matcha App! 👋 </h4>
                        <p class="card-text mb-2" style="font-size: small; color: #6e6b7b; margin-bottom: 40px; margin-top: 0; text-align: center;">
                            <span>Everything is so <span style="font-weight: 900;color:#78b34d"> Matcha </span> better
                                with
                                you</span>
                        </p>
                        <div class="p-fluid ">
                            <div class="field p-mb-4 col-12 md:col-12 sm:col-12">
                                <span class="p-float-label p-input-icon-left">
                                    <i class="pi pi-user" />

                                    <InputText id="inputtext" :class="{'p-invalid': hasError}" type="text"
                                        v-model="authForm.username" />
                                    <label for="inputtext">Username</label>
                                </span>
                                <small id="username2-help" v-if="errorMessages.username !== null"
                                    class="p-error">{{errorMessages.username}}</small>
                            </div>
                            <div class="field p-mb-4 col-12 md:col-12 sm:col-12">
                                <span class="p-float-label p-input-icon-left">
                                    <i class="pi pi-lock" />
                                    <Password :class="{'p-invalid': hasErrorPassword}" :feedback="false" v-on:keyup.enter="userLogin()" id="inputtext-left"
                                        toggleMask v-model="authForm.password"> </Password>
                                    <label for="inputtext-left">Password</label>
                                </span>
                                <small v-if="errorMessages.password !== null"
                                    class="p-error">{{errorMessages.password}}</small>
                            </div>

                            <div v-if="errors !== null">
                                <Message severity="error">{{errors}}</Message>
                            </div>

                            <div class="field p-mb-1 col-12 md:col-12 sm:col-12">
                                <Button :loading="loadingButton" label="Login" @click="userLogin()"
                                    class="p-mb-2 p-ripple" style="border-color: #a49df5!important; background-color: #a49df5!important;" />
                                <Button @click="goToSSO()" label="SSO BPS" class="p-button-info" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <Loading v-model:active="loadingDialog" :is-full-page="true" :color="'#86d166'" :background-color="'black'"
            :opacity="0.75">
            <slot>
                <MyLoading></MyLoading>
            </slot>
        </Loading> 

        <Toast/>

    </div>
</template>

<script>
    // import DataService from '../services/DataService'
    import Toast from 'primevue/toast';
    import InputText from 'primevue/inputtext';
    import Tooltip from 'primevue/tooltip';
    import Password from 'primevue/password';
    import Message from 'primevue/message';
    import Keycloak from 'keycloak-js'
    import MyLoading from '../components/MyLoading2.vue'
    import Loading from 'vue-loading-overlay';
    import 'vue-loading-overlay/dist/vue-loading.css';
import DataService from '../services/DataService';

    export default {
        components: {
            InputText,
            Password,
            Message,
            MyLoading,
            Loading,
            Toast
        },
        directives: {
            'tooltip': Tooltip
        },
        data() {
            return {
                hasError: false,
                hasErrorPassword: false,
                matchaMessage: [
                    'I love you so matcha',
                    'Ah, so matcha better',
                    'The key to life is positivi-tea.',
                    'All of our codes and apps are quali-tea',

                ],
                authForm: {
                    username: null,
                    password: null,
                },
                errorMessages: {
                    username: null,
                    password: null
                },
                errors: null,
                loadingButton: false,
                keycloak: null,
                isLoggedInSSO: false,
                loadingDialog: true,
                isSsoEnable: false
            }
        },     
        async mounted() {
            const result = await this.getConfigSSO() 

            if(result.data.meta.status == 'error') {
                this.$toast.add({
                    severity: 'error',
                    summary: 'Error Occurred!',
                    detail: result.data.meta.message,
                    life: 2000
                });                
            }

            if(result.data.meta.status == 'success' && result.data.data.configvalue == '1') {
                this.isSsoEnable = true
                this.keycloakFunction() 
                return
            } 

            this.loadingDialog = false
        },    
        methods: {
            getConfigSSO() {
                return DataService.getConfigSSO()
            },
            keycloakFunction() {

                this.keycloak = new Keycloak({
                    url: 'https://sso.bps.go.id/auth',
                    realm: 'pegawai-bps',
                    clientId: `${process.env.VUE_APP_SSO_CLIENT_ID}`,
                })                             
                
                this.keycloak.init({
                    onLoad: "check-sso",
                    scope: "openid profile-pegawai",
                    checkLoginIframe: false,
                    responseMode: 'query'
                }).then( async (res) => {
                    this.isLoggedInSSO = res
                    this.loadingDialog = res
                    // kalo status login sso nya masih aktif
                    if(this.isLoggedInSSO) {
                        // console.log(this.keycloak.idTokenParsed)                        
                        // console.log(this.keycloak.token)
                        const userSSO = await this.getDataUserFromSSO()
                        const userMatcha = await this.getTokenMatchaAfterSSO(userSSO.data.username)
                        if(userMatcha.data.meta.status == 'error') {
                            this.loadingDialog = false
                            this.errors = userMatcha.data.meta.message
                            return
                        }
                        this.$store.dispatch('login_sso', userMatcha.data)
                        let userRoles = userMatcha.data.data.user.roles,
                            filteredRoles = userRoles.find(role => role.name == "ROLE_ADMIN"),
                            nameRoute = filteredRoles == undefined ? 'dashboardUser' : 'dashboardAdmin';

                        this.$router.push({
                            name: nameRoute
                        });

                    }
                    
                }).catch((err) => { 
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Error Occurred!',
                        detail: 'Something went wrong with sso, contact admin!',
                        life: 4000
                    }); 
                    console.log('something went wrong with sso ...', err)                       
                })

            },
            getDataUserFromSSO() {                
                return DataService.getDataUserFromSSO(this.keycloak.token)                    
            },
            getTokenMatchaAfterSSO(username) {
                return DataService.getTokenMatchaAfterSSO(username)
            },
            goToSSO(){
                if(this.isSsoEnable) {
                    let redirectSSO = process.env.VUE_APP_SSO_REDIRECT_URL
                    let clientIdSSO =  process.env.VUE_APP_SSO_CLIENT_ID
                    let ssoLink = `https://sso.bps.go.id/auth/realms/pegawai-bps/protocol/openid-connect/auth?client_id=${clientIdSSO}&redirect_uri=${encodeURIComponent(redirectSSO)}&response_type=code&scope=openid`
                    location.href = ssoLink
                }                
            },
            userLogin() {
                if (this.authForm.username !== null && this.authForm.password !== null) {
                    this.loadingButton = true
                    this.$store.dispatch('login', this.authForm)
                        .then(response => {

                            this.loadingButton = false

                            // kalo username
                            if (response.data.meta.status == 'error') {
                                this.errors = response.data.meta.message
                                return;
                            }

                            let userRoles = response.data.data.user.roles,
                                filteredRoles = userRoles.find(role => role.name == "ROLE_ADMIN"),
                                nameRoute = filteredRoles == undefined ? 'dashboardUser' : 'dashboardAdmin';

                            this.$router.push({
                                name: nameRoute
                            });

                        }).catch(() => {
                            // console.log('myerror', error)
                            this.loadingButton = false
                            this.errors = 'Ups ada error :('
                        })
                }

                if(this.authForm.username == null) {
                    this.errorMessages.username = 'Username tidak boleh kosong'
                    this.hasError = true
                } else {
                    this.errorMessages.username = null
                    this.hasError = false
                }

                if(this.authForm.password == null) {
                    this.errorMessages.password = 'Password tidak boleh kosong'
                    this.hasErrorPassword = true
                } else {
                    this.errorMessages.password = null
                    this.hasErrorPassword = false
                }
            }
        }
    }
</script>

<style scoped>

    ::v-deep(.p-button:focus) {
        box-shadow: none !important;
    }

    ::v-deep(.p-inputtext:enabled:focus) {
        box-shadow: none !important;
    }

    
    .auth-wrapper.auth-v1 {
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: center;
        -ms-flex-pack: center;
        justify-content: center;
        overflow: hidden;
    }

    .pl-2,
    .px-2 {
        padding-left: 1.5rem !important;
    }

    .pr-2,
    .px-2 {
        padding-right: 1.5rem !important;
    }

    .auth-wrapper {
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-preferred-size: 100%;
        flex-basis: 100%;
        min-height: 100vh;
        min-height: calc(var(--vh, 1vh)*100);
        width: 100%;
    }

    .auth-wrapper.auth-v1 .auth-inner {
        max-width: 400px;
    }

    .auth-wrapper .auth-inner {
        width: 100%;
        position: relative;
    }

    .pb-2,
    .py-2 {
        padding-bottom: 1.5rem !important;
    }

    .pt-2,
    .py-2 {
        padding-top: 1.5rem !important;
    }

    .auth-wrapper.auth-v1 .auth-inner:before {
        left: -46px;
    }

    .auth-wrapper.auth-v1 .auth-inner:before {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAPQAAADzCAMAAACG9Mt0AAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAA9KADAAQAAAABAAAA8wAAAADhQHfUAAAAyVBMVEUAAAD///+AgP+AgP9mZv+AgNWAgP9tbf9gYP+AgP9xcf9mZv+AZuaAgP9dXf90dOhiYv92dv9mZu5mZv93d+53d/9paf94afCAcfFrXvJra/9mZvJzZvJzc/JoaP96b/Rqav91aupsYvV2bOt2bPVxaPZ7cfZqavZyau1waPd4aO9xafBxafh4afB1bfh4avFuZ/F2afJzZvJzZ/N0aPN0bvN3bPR0ae5yZ/R3be93bfR1au9zafBxbPVzavV0a/F0a/ZyafFwaPKZm3nTAAAAQ3RSTlMAAQIEBQYGBwgICQoKCgsLDQ0PDw8PERESExMUFBQWFxgYGhoaGxsdHSAgIiIiIyQlJygqLCwtLi8vLzAzNDU3Nzg7h9vbHgAAA9RJREFUeNrt3ftS2kAUx/Fc1gSyWsErtuJdRDQiiteolb7/QzUoTm07k4AzObuu3/MCez45yWbzT36eZ6b8erO1e1B97baadd+zocJWmg0HaXe/+uqmg2GWtkLT5Lle1m9LdhG2+1lvzuiUO1knEF81yFc1N+35m15kZOGodz1vyLx+v2Lseq/erxtZd/NuweCTtfiwaWLOD5FnsqI7+VnP3y8afnEs3Es/1+H1qvETwuq18B7e6VlwLup1ZM8kWWQBOsrmHL7GVtxvYRZYgQ4ywae61ffsqH5Lbq20bQm6ncp9P2ehJegwE/u+rl95ttSwLrVSc2ANetAU28dSa9Cp2E623bUG3d2VWmn/wBq0XCugQYMGLdVKoOJaoiuok1NdXSW1WAUfRPtRUllflaJf5ZE/O9pXVbZUPTov5c+IDqvtRwStdTgLutoxy6GnGfYb2o+1I2gd+1OiqzfLocvVE7TSDqG1mgodaqfQZbvZC9rXjqG1X45WzqFVKVpk0LLo4lGP0ZGD6KgMnTiITkrQgXYQrYNitHISrYrRsZPouBhdcxJdK0YnTqKTYrR2Eq1BgwYNGjRo0KBBgwYNGjRo0KBBgwYNGjRo0KBBgwYNGjRo0KBBgwYNGjRo0KBBgwYNGjRo0KBBgwYNGjRo0KBBgwYNGjRo0KBBgwYNGjRoh9DH59ag86ACoSYOL61B55EUQk1s3VqDzsNHhJpYe7QGncfMSHUxaliCHgcKSXVxeWQJehwdJdXF4dAS9DgkTKqLxuibFeiXODixNi7OrEC/BP+JtbE0WrYA/RrxKNfH2YUF6NegSbk+Gk87xtErN6EsWm88fzeMXpwE9EruLns/l42io4dJFLPo2/Po1w+D6IW7t9Bt2SPx3vOOMfS7eHVZtN54ulg2go56138Ct4XRunE2Ovsmjg46WeddUoUWr6WL0fCoIYgO2/2s91fstDZQjcPL0ePt5flpdXUwqW46uMrS1j95JNpQrW0dHp9UV/uT2m416/8HVGg3qzhpBjRo0KBBgwYNGjRo0KBBgwYNGjRo0KBBgwYNGjRo0KBBgwYNGjRo0KBBgwYNGjRo0KBBgwYNGjRo0KBBgwYNGjRo0KBBgwYNGjRo0KBBgwYNGjRo0KC/FDpx0pwUo2tOomvF6NhJdFyMVk6iVTE6cBIdeF9vJyvZx/I/AzuIjsrQvoNovwzt4FamSs0Ojrp80PmvoB0zh940pb7azf1yg7t0LIt978uppzbnalfucDW92ZndLPRmKweGPduYJ+zoM5/Dk+gD5NdvLhXXPp88qcUqmEH5G5JZRs6cuxwIAAAAAElFTkSuQmCC);
    }

    .auth-wrapper.auth-v1 .auth-inner:before {
        width: 244px;
        height: 243px;
        content: " ";
        position: absolute;
        top: -54px;
    }

    .card {
        border: none;
        margin-bottom: 2rem;
        -webkit-box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%);
        box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%);
    }

    .mb-0,
    .my-0 {
        margin-bottom: 0 !important;
    }

    .card {
        background-color: #fff;
        background-clip: border-box;
        border: 1px solid rgba(34, 41, 47, .125);
        border-radius: 0.428rem;
    }

    .card {
        -webkit-transition: all .3s ease-in-out, background 0s, color 0s, border-color 0s;
        transition: all .3s ease-in-out, background 0s, color 0s, border-color 0s;
    }

    .card {
        position: relative;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -webkit-box-orient: vertical;
        -webkit-box-direction: normal;
        -ms-flex-direction: column;
        flex-direction: column;
        min-width: 0;
        word-wrap: break-word;
        padding: 25px;
    }

    .auth-wrapper.auth-v1 .auth-inner:after {
        right: -75px;
    }

    .auth-wrapper.auth-v1 .auth-inner:after {
        background-image: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARAAAAEQCAMAAABP1NsnAAAAAXNSR0IArs4c6QAAAERlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAABEKADAAQAAAABAAABEAAAAAAQWxS2AAAAwFBMVEUAAAD///+AgICAgP9VVaqqVf+qqv+AgL+AgP9mZsxmZv+ZZv+AgNWAgP9tbdttbf+Sbf+AYN+AgN+AgP9xceNmZv+AZuaAZv90dOh0dP9qav+AauqAav+AgP92dv9tbf+Abe2Abf93Zu53d+6AcO94afCAcfF5a+R5a/JzZuaAZvKAc/J5bed5bfOAaPN6b/R1auqAavR6ZvV6cPV2bOuAbPV7aPZ2be2AbfZ7au17avZ3Zu53b+57a+97a/d4aO9J6CoeAAAAQHRSTlMAAQICAwMDBAQFBQUGBgcHBwgICAkKCgoLCwwMDAwNDg4ODw8QERITExQUFBUVFhcYGBkZGhobHBwdHR4eHx8gJ5uMWwAAA/FJREFUeNrt2G1XEkEYxvHZNk2xHGzdbKFl0cTwgdSkCKzu7/+t4pw6sAjtjIueE/f8r3fMO35nZnbuy5gVGcvfzJe0rnTfGI+MggGJRUZnbpPIhJKt88nU53JnFULvyISY6KAv8vPj0vr2rYwiE2Z2B9J+uNYcyyQxwWZvaeGH3G4bMjsvI/kcwTC/V+7kLoahlITzQojP3ZFgsJCh7IJQzpX0QFj4uMiY18eDMZ9bZCF9OQahnK6cm/Y7js0sh/LF3Auv1PlQd3MxbdXYIQspV44EEEAAAWTNDAYYkKdJbNMsLzYueZbaZ2iM46RVbHBaiZ9Js+nHEdli42N9XuSen5hGp1CQTuOJQDRsD99N4gMSpYWapNH6IJo83CIeILZQFesEaber79NCWRoukOpNEnW0gXQqD81w6ACxhbrYde7VuFCYeA2QRCNIsgZISyNIqz6IyhPjOjNVIFYniK3dmKU6QdLaJUimEySrDZLrBMlrgxRKU7sxCw/EMe0CAggggADySJCqxixIkKpNEh6IozELD8RxjQACCCCAAPJIkKrGLEgQXqqAAEJjxrQLCCCAAEJjRmNGY8a0CwgggABCYwYIfQgggNCYMe0CAggggNCY0ZjRmDHtAgIIIIAAQmNGHwIIIDRmTLuAAAIIIDRmNGY0Zky7gAACCCCA0JjRhwACCI0Z0y4ggAACCI0ZjRmNGdMuIIAAAgggNGb0IYAAQmPGtAsIIIAAQmNGY0ZjxrQLCCCAAAIIjRl9CCCA0Jgx7QICCCCA0JjRmNGYMe0CAggggABCY0YfAgggNGZMu4AAAgggNGY0ZjRmTLuAAAIIIIDQmNGHAAIIjRnTLiCAAAIIjRmNGY0ZIEy7gAACCCA0ZvQhgABCY8a0CwgggABCY0ZjBgiNGdMuIIAAAgiN2f/Sh+Q6PfLaIJlOkKw2SKoTJK3dmFmdILb2tBvrBIlrg5iWRo+WqQ+SaARJ1gCJAzsxThCN16p1vNurGjNjoo42j07kAHFskoY2kEbl33U0ZgoPjXW+Rl0gkarnahqtDaJKxMPDDWIiNafGenh4gExvVhXfmk7Da6L1AVGxSby2h6MxK79Zk42ea1pJbJ48sU2zDezQ8iy1z6BBwoyjMQsvXp8YQAAhgADilRfyy+wf8WqZZUfGZihvgZiB3FybC+kCUU5XLkAo50C+gbBQdUzkAIVyejIAYfFTI1solHP2HgNCnHn5AYNy4jvpoVB6fVzL91cwzLJ9Lfd7S0jhehxO5H5/yePr1W6gHonI7fJ5ORSR/n6Q2yQanq763zuXU5LJZRKiyD/W9/pjkdPZz0/yJ8fqVyry+qQZDMjJKoDfy8bRVhHhQTwAAAAASUVORK5CYII=);
    }

    .auth-wrapper.auth-v1 .auth-inner:after {
        width: 272px;
        height: 272px;
        content: " ";
        position: absolute;
        bottom: -55px;
        z-index: -1;
    }

    .auth-wrapper .brand-logo {
        margin: 1rem 0 2rem 0;
    }
</style>