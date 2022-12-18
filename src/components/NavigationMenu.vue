<template>
    <div class="p-d-flex p-grid p-jc-between ">
        <div v-if="currentUser.roles.find(role => role.name == 'ROLE_ADMIN') != undefined" class="container-nav-matcha" :class="this.$route.fullPath == '/dashboard/admin' ? 'active' : ''">
            <router-link :to="{name: 'dashboardAdmin'}" @click="this.$emit('showSideBar');">
                <div>
                    <i class="pi pi-check-circle p-mr-2 p-ml-2"></i>
                    Progres All
                </div>
            </router-link>            
        </div>

        <div v-if="currentUser.roles.find(role => role.name == 'ROLE_USER') != undefined" class="container-nav-matcha" :class="this.$route.fullPath == '/dashboard' ? 'active' : ''">
            <router-link :to="{name: 'dashboardUser'}" @click="this.$emit('showSideBar')">
                <div>
                    <i class="pi pi-th-large p-mr-2 p-ml-2"></i>
                    Dashboard
                </div>
            </router-link>
        </div>

        <div v-if="currentUser.roles.find(role => role.name == 'ROLE_SUPERVISOR') != undefined" class="container-nav-matcha" :class="this.$route.fullPath == '/analytics' ? 'active' : ''">
            <router-link :to="{name: 'analytics'}" @click="this.$emit('showSideBar')">
                <div>
                    <i class="pi pi-chart-line p-mr-2 p-ml-2"></i>
                    Analytics
                </div>
            </router-link>
        </div>


        <div v-if="currentUser.roles.find(role => role.name == 'ROLE_USER') != undefined" class="container-nav-matcha" :class="this.$route.fullPath == '/matching' ? 'active' : ''">
            <router-link :to="{name: 'matching'}" @click="this.$emit('showSideBar')">
                <div>
                    <i class="pi pi-table p-mr-2 p-ml-2"></i>
                    Matching
                </div>
            </router-link>
        </div>

        <div v-if="currentUser.roles.find(role => role.name == 'ROLE_USER') != undefined" class="container-nav-matcha" :class="this.$route.fullPath == '/assessment' ? 'active' : ''">
            <router-link :to="{name: 'assessment'}" @click="this.$emit('showSideBar');">
                <div>
                    <i class="pi pi-check-circle p-mr-2 p-ml-2"></i>
                    Assessment
                </div>
            </router-link>
        </div>

        <div v-if="currentUser.roles.find(role => role.name == 'ROLE_ADMIN') != undefined" style="cursor: pointer;margin-left: 6px;line-height: 1.45;font-size: 1.1rem;color: #625f6e;"
            @click="this.showSubMenuAlokasi = !this.showSubMenuAlokasi" class="container-nav-matcha" >
            <div>
                <i class="p-mr-2 p-ml-2'" :class="cursorSubMenuAlokasi"></i>
                Alokasi
            </div>
        </div>

        <div v-show="showSubMenuAlokasi" class="animate__animated animate__fadeIn animate__faster" style="width: 100%;">
            <div class="container-nav-matcha" :class="this.$route.fullPath == '/alokasi/matching' ? 'active' : ''">
                <router-link :to="{name: 'alokasiMatching'}" @click="this.$emit('showSideBar')">
                    <div>
                        <i class="pi pi-circle p-mr-2 p-ml-2"></i>
                        Matching
                    </div>
                </router-link>
            </div>
            <div class="container-nav-matcha" :class="this.$route.fullPath == '/alokasi/assessment' ? 'active' : ''">
                <router-link :to="{name: 'alokasiAssessment'}" @click="this.$emit('showSideBar')">
                    <div>
                        <i class="pi pi-circle p-mr-2 p-ml-2"></i>
                        Assessment
                    </div>
                </router-link>
            </div>
        </div>

        <div class="container-nav-matcha" :class="this.$route.fullPath == '/kegiatan' ? 'active' : ''">
            <router-link v-if="currentUser.roles.find(role => role.name == 'ROLE_ADMIN') != undefined"
            :to="{name: 'kegiatan'}" @click="this.$emit('showSideBar')">
                <div>
                    <i class="pi pi-box p-mr-2 p-ml-2"></i>
                    Kegiatan
                </div>
            </router-link>
        </div>
        
        <div class="container-nav-matcha" :class="this.$route.fullPath == '/manajemen-user' ? 'active' : ''">
            <router-link v-if="currentUser.roles.find(role => role.name == 'ROLE_ADMIN') != undefined"
            :to="{name: 'manajemenUser'}" @click="this.$emit('showSideBar')">
                <div>
                    <i class="pi pi-user p-mr-2 p-ml-2"></i>
                    Users
                </div>
            </router-link>
        </div>
    </div>
</template>

<script>
    import Tooltip from 'primevue/tooltip';
    export default {
        components: {

        },
        directives: {
            'tooltip': Tooltip
        },
        watch: {
            showSubMenuAlokasi(value) {                
                console.log(value)
                this.cursorSubMenuAlokasi = value ? 'pi pi-chevron-down' : 'pi pi-chevron-right'
            }
        },
        data() {
            return {
                showSubMenuAlokasi: ['/alokasi/matching', '/alokasi/assessment'].includes(this.$route.fullPath),
                cursorSubMenuAlokasi: ['/alokasi/matching', '/alokasi/assessment'].includes(this.$route.fullPath) ? 'pi pi-chevron-down' : 'pi pi-chevron-right',
                matchaMessage: [
                    'I love you so matcha',
                    'Ah, so matcha better',
                    'The key to life is positivi-tea.',
                    'All of our codes and apps are quali-tea',

                ],
                selectedMenu: '',
                selectedMenuHistory: '',
                subMenuAlokasi: false,
                subMenuHistory: false,
                MenuIcon: 'pi pi-chevron-right',
                MenuIconHistory: 'pi pi-chevron-right',
                darklightIcon: 'pi pi-moon',

                showsidebar: false,
                visibleLeft: false,
                sidebarClass: "p-col-0 p-md-0 p-lg-0",
                contentClass: "p-col-12 p-md-12 p-lg-12",
            }
        },
        created() {

        },
        computed: {
            myBgColorData() {
                return this.$store.state.mainstyle.myBgColorData
            },
            myTextColorData() {
                return this.$store.state.mainstyle.myTextColorData
            },
            currentUser() {
                return this.$store.state.auth.user
            }
        },
        methods: {
            logout: function () {
                this.$store.dispatch("logout").then(() => {
                    this.$router.push("/");
                });
            },
            subMenuAlokasiTrigerred() {
                if (this.subMenuAlokasi == false) {
                    this.subMenuAlokasi = true
                    this.MenuIcon = 'pi pi-chevron-down'
                    this.selectedMenu = 'selectedMenu'
                } else {
                    this.subMenuAlokasi = false
                    this.MenuIcon = 'pi pi-chevron-right'
                    this.selectedMenu = ''
                }
            },
            subMenuHistoryTrigerred() {
                if (this.subMenuHistory == false) {
                    this.subMenuHistory = true
                    this.MenuIconHistory = 'pi pi-chevron-down'
                    this.selectedMenuHistory = 'selectedMenu'
                } else {
                    this.subMenuHistory = false
                    this.MenuIconHistory = 'pi pi-chevron-right'
                    this.selectedMenuHistory = ''
                }
            },
            // sideBar() {
            //     if (this.sidebarClass == "p-col-0 p-md-0 p-lg-0") {
            //         // this.sidebarClass = "p-col-2 p-md-2 p-lg-2"
            //         // this.contentClass = "p-col-10 p-md-10 p-lg-10"
            //         this.showsidebar = true
            //         this.visibleLeft = true
            //     } else {
            //         // this.sidebarClass = "p-col-0 p-md-0 p-lg-0"
            //         // this.contentClass = "p-col-12 p-md-12 p-lg-12"
            //         // this.showsidebar = false
            //     }
            // },
            darklight() {
                if (this.myBgColorData == 'mydarkbgcolor') {
                    // this.myBgColorData = 'mylightbgcolor'
                    this.darklightIcon = 'pi pi-moon'
                    this.$store.dispatch('mainstyle/setTheme', 'mylightbgcolor', {
                        root: true
                    })
                } else {
                    this.darklightIcon = 'pi pi-sun'
                    this.$store.dispatch('mainstyle/setTheme', 'mydarkbgcolor', {
                        root: true
                    })
                }
            },
            toggle(event) {
                this.$refs.op.toggle(event);
            }
        }
    }
</script>

<style scoped>
    .container-nav-matcha {
        width: 100% !important;
        padding-left: 15px;
        margin-top: 15px;
    }

    .container-nav-matcha a {
        text-decoration: none;
        color: #625f6e;
        line-height: 1.45;
        font-size: 1.1rem;
        font-weight: 400;
    }

    .container-nav-matcha a:hover>* {
        transform: translateX(5px);
        transition: transform .25s ease, -webkit-transform .25s ease;
    }

    .container-nav-matcha.active>a {
        color: white;
    }

    .container-nav-matcha.active {
        box-shadow: 0 0 10px 1px rgb(115 103 240 / 70%);
        border-radius: 4px;
        background: linear-gradient(118deg, #7367f0, rgba(115, 103, 240, .7));
        padding-top: 10px;
        padding-bottom: 10px;
        padding-left: 15px;
    }


    /* .router-link-active .router-link-exact-active {
        color: red !important;
        background-color: red !important;
    }

    .mydarkbgcolor {
        background-color: #28243d;
    }

    .mylightbgcolor {
        background-color: #f4f5fa;
    }

    .mydarkcardcolor {
        background-color: #312d4b;
    }

    .mylightcardcolor {
        background-color: #ffffff
    }

    .mydarktext-color {
        color: #cfcbe4;
    }

    .mylighttext-color {
        color: #726b7c;
    }

    .selectedMenu {
        background-color: #9155fd;
        color: white;

    }


    .hvr-fade {
        display: inline-block;
        vertical-align: middle;
        -webkit-transform: perspective(1px) translateZ(0);
        transform: perspective(1px) translateZ(0);
        box-shadow: 0 0 1px rgba(0, 0, 0, 0);
        overflow: hidden;
        -webkit-transition-duration: 0.3s;
        transition-duration: 0.3s;
        -webkit-transition-property: color, background-color;
        transition-property: color, background-color;
    }

    .hvr-fade:hover,
    .hvr-fade:focus,
    .hvr-fade:active {
        background-color: #9155fd;
        color: white;
    }

    .myhover:hover {
        background-color: #9155fd;
    } */


    /* Pulse Grow */
    /* @-webkit-keyframes hvr-pulse-grow {
        to {
            -webkit-transform: scale(1.8);
            transform: scale(1.8);
        }
    }

    @keyframes hvr-pulse-grow {
        to {
            -webkit-transform: scale(1.8);
            transform: scale(1.8);
        }
    }

    .hvr-pulse-grow {
        display: inline-block;
        vertical-align: middle;
        -webkit-transform: perspective(1px) translateZ(0);
        transform: perspective(1px) translateZ(0);
        box-shadow: 0 0 1px rgba(0, 0, 0, 0);
    }

    .hvr-pulse-grow:hover,
    .hvr-pulse-grow:focus,
    .hvr-pulse-grow:active {
        -webkit-animation-name: hvr-pulse-grow;
        animation-name: hvr-pulse-grow;
        -webkit-animation-duration: 0.3s;
        animation-duration: 0.3s;
        -webkit-animation-timing-function: linear;
        animation-timing-function: linear;
        -webkit-animation-iteration-count: infinite;
        animation-iteration-count: infinite;
        -webkit-animation-direction: alternate;
        animation-direction: alternate;
    } */

    /* Bob */
    /* @-webkit-keyframes hvr-bob {
        0% {
            -webkit-transform: translateY(-8px);
            transform: translateY(-8px);
        }

        50% {
            -webkit-transform: translateY(-4px);
            transform: translateY(-4px);
        }

        100% {
            -webkit-transform: translateY(-8px);
            transform: translateY(-8px);
        }
    }

    @keyframes hvr-bob {
        0% {
            -webkit-transform: translateY(-8px);
            transform: translateY(-8px);
        }

        50% {
            -webkit-transform: translateY(-4px);
            transform: translateY(-4px);
        }

        100% {
            -webkit-transform: translateY(-8px);
            transform: translateY(-8px);
        }
    }

    @-webkit-keyframes hvr-bob-float {
        100% {
            -webkit-transform: translateY(-8px);
            transform: translateY(-8px);
        }
    }

    @keyframes hvr-bob-float {
        100% {
            -webkit-transform: translateY(-8px);
            transform: translateY(-8px);
        }
    }

    .hvr-bob {
        display: inline-block;
        vertical-align: middle;
        -webkit-transform: perspective(1px) translateZ(0);
        transform: perspective(1px) translateZ(0);
        box-shadow: 0 0 1px rgba(0, 0, 0, 0);
    }

    .hvr-bob:hover,
    .hvr-bob:focus,
    .hvr-bob:active {
        -webkit-animation-name: hvr-bob-float, hvr-bob;
        animation-name: hvr-bob-float, hvr-bob;
        -webkit-animation-duration: .3s, 1.5s;
        animation-duration: .3s, 1.5s;
        -webkit-animation-delay: 0s, .3s;
        animation-delay: 0s, .3s;
        -webkit-animation-timing-function: ease-out, ease-in-out;
        animation-timing-function: ease-out, ease-in-out;
        -webkit-animation-iteration-count: 1, infinite;
        animation-iteration-count: 1, infinite;
        -webkit-animation-fill-mode: forwards;
        animation-fill-mode: forwards;
        -webkit-animation-direction: normal, alternate;
        animation-direction: normal, alternate;
    } */
</style>