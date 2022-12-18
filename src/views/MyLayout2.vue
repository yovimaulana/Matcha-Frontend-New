<template>
    <div class="p-grid p-ai-stretch nested-grid p-nogutter" style="min-height: 100vh;">
        <Sidebar v-model:visible="visibleLeft" :class="myBgColorData+' '+myTextColorData" style="width: 260px;">
            <div class="animate__animated animate__slideInLeft animate__faster">
                <div class="p-grid p-jc-center p-d-flex p-flex-column p-ac-center ">
                    <img src="../assets/matcha.png" class="hvr-bob p-mt-4"
                        v-tooltip.right="{value: this.matchaMessage[Math.floor(Math.random()*this.matchaMessage.length)], class: 'custom-error'}"
                        style="width: 20%; height: 18%;" alt="" srcset="">

                </div>
                <div class="p-grid p-jc-center  p-ac-center " style="margin-top: -7%;">
                    <h2 class="" style="color: #78b34d; font-weight: 700;">MatchA</h2>
                </div>
                <NavigationMenu @showSideBar="sideBar" />
            </div>
        </Sidebar>

        <div :class="contentClass + ' '+ myBgColorData" style="position:relative">
            <nav class="navbar header-navbar navbar-shadow align-items-center narbar-light navbar-expand"
                style="padding: 0">
                <div class="p-d-flex container-navbar">
                    <Button icon="pi pi-bars" @click="sideBar"
                        class="p-button-text  p-button-secondary p-button onclick-btn-custom" />
                    <div style="margin-left: auto; display: flex; align-items: center;">
                        <Button :icon="darklightIcon"
                            class="p-button-text p-button-rounded  p-button-secondary p-button p-mr-2 onclick-btn-custom"
                            @click="darklight() " />
                        <div class="user-nav">
                            <p style="margin-top: 0; margin-bottom: 0; font-weight: 600 !important; color: #6e6b7b;">
                                {{!currentUser ? '' : currentUser.name }}
                            </p>
                            <span
                                style="font-size: smaller; color: #6e6b7b; float: right; ">{{!currentUser ? '' : (currentUser['roles'].find((data) => data.name == 'ROLE_ADMIN') ? 'Admin' : 'User') }}</span>
                        </div>
                        <span class="container-user-icon">
                            <Button id="btn-navbar-user" icon="pi pi-user" @click="toggle" aria-haspopup="true"
                                aria-controls="overlay_tmenu"
                                class="p-button-rounded p-button-secondary p-button-lg onclick-btn-custom"
                                style="margin-left: 5px" />
                            <Badge style="bottom:0; right: 0; height: 0.5rem !important" class="p-badge-dot p-badge-success badge-container-st"
                                severity="success" size="small">
                            </Badge>
                            <TieredMenu id="overlay_tmenu" ref="menu" :popup="true" :model="itemsNav"
                                style="margin-top: 25px;">
                                <template #item="{item}">
                                    <div v-if="item.label == 'Logout'" @click="logout"
                                        style="cursor: pointer; padding: 10px"><i class="pi pi-fw pi-power-off"></i>
                                        <span style="margin-left: 10px;">{{ item.label }}</span></div>
                                    <router-link v-else :to="{name: item.url}"
                                        style="text-decoration: none; color: inherit;">
                                        <div style="cursor: pointer; padding: 10px;"><i class="pi pi-fw pi-user"
                                                style="margin-right: 10px;"></i> {{item.label}} </div>
                                    </router-link>
                                </template>
                            </TieredMenu>
                        </span>
                    </div>
                </div>
            </nav>

            <div class="p-col-12" style="padding-left: 15px; padding-right: 15px; padding-bottom: 15px">
                <div class="">
                    <router-view v-slot="{ Component }">
                        <transition name="slide" mode="out-in">
                            <component :is="Component" :key="$route.path"></component>
                        </transition>
                    </router-view>
                </div>
            </div>

            <!-- Footer -->
            <div class="p-col-12" style="bottom: 0; width: 100%; position: absolute; height: 15px;">
                <div class="p-d-flex p-ai-stretch p-jc-between">
                    <p class="p-ml-6">COPYRIGHT © 2022 <span style="color: #00aeef;font-weight: 700;">B</span><span
                            style="color: #8cc63f;font-weight: 700;">P</span><span
                            style="color: #f7941e;font-weight: 700;">S</span>, All rights Reserved | Thank you so <span
                            style="color: #78b34d; font-weight: 700;">MatchA</span> for what you do</p>
                    <p class="p-mr-6"><span style="font-weight: 700;">&lt; /&gt; &nbsp;</span> dengan <i
                            class="p-ml-2 pi pi-heart-fill animate__animated animate__flash animate__slow animate__infinite	infinite hvr-pulse-grow "
                            style="color: #D32F2F"></i></p>
                </div>
            </div>
        </div>

    </div>

</template>

<script>
    import OverlayPanel from 'primevue/overlaypanel';
    import Tooltip from 'primevue/tooltip';
    import NavigationMenu from '../components/NavigationMenu.vue'
    import Card from 'primevue/card'
    import Badge from 'primevue/badge'
    import TieredMenu from 'primevue/tieredmenu';
    export default {
        components: {
            OverlayPanel,
            NavigationMenu,
            Card,
            Badge,
            TieredMenu
        },
        directives: {
            'tooltip': Tooltip
        },
        data() {
            return {
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
                // sidebarClass: "p-col-0 p-md-0 p-lg-0",
                contentClass: "p-col-12 p-md-12 p-lg-12",
                itemsNav: [{
                        label: 'Profile User',
                        icon: 'pi pi-fw pi-user',
                        url: 'dashboardUser'
                    },
                    {
                        separator: true
                    },
                    {
                        label: 'Logout',
                        icon: 'pi pi-fw pi-power-off',
                    }
                ],
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
                    // this.$router.push("/");  
                    let redirectSSO = process.env.VUE_APP_SSO_REDIRECT_URL                  
                    let ssoLink = `https://sso.bps.go.id/auth/realms/pegawai-bps/protocol/openid-connect/logout?redirect_uri=${encodeURIComponent(redirectSSO)}`
                    location.href = ssoLink
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
            sideBar() {
                this.visibleLeft == true ? this.visibleLeft = false : this.visibleLeft = true
            },
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
                // this.$refs.op.toggle(event);
                this.$refs.menu.toggle(event);
            }
        }
    }
</script>

<style scoped>
    .user-nav {
        display: inline-block;
        font-size: smaller;
        margin-right: 5px;
    }

    @media (max-width: 400px) {
        .user-nav {
            display: none
        }
    }


    button.onclick-btn-custom {
        box-shadow: none !important;
    }

    .container-user-icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        vertical-align: middle;
        flex-shrink: 0;
        line-height: 1;
        max-width: 100%;
        overflow: visible;
        position: relative;
        transition: color .15s ease-in-out, background-color .15s ease-in-out, box-shadow .15s ease-in-out, -webkit-box-shadow .15s ease-in-out;
    }

    .badge-container-st {
        bottom: 0px;
        right: 0px;
        min-height: 11px;
        min-width: 11px;
        z-index: 1;
        position: absolute;
        line-height: 1;
    }

    .header-navbar.navbar-shadow {
        box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%);
    }


    .header-navbar {
        margin: 1.3rem 2rem 0;
        border-radius: 0.428rem;
    }

    .navbar-light {
        background: #ffffff !important;
    }

    .header-navbar {
        padding: 0;
    }

    .navbar {
        padding: 0.5rem 1rem;
    }

    .header-navbar {
        min-height: 4.45rem;
        font-family: Montserrat, Helvetica, Arial, serif;
        -webkit-transition: all .3s ease, background 0s;
        transition: all .3s ease, background 0s;
        z-index: 997;
    }

    .align-items-center {
        -webkit-box-align: center !important;
        -ms-flex-align: center !important;
        align-items: center !important;
    }

    .navbar-expand {
        -webkit-box-orient: horizontal;
        -webkit-box-direction: normal;
        -ms-flex-flow: row nowrap;
        flex-flow: row nowrap;
        -webkit-box-pack: start;
        -ms-flex-pack: start;
        justify-content: flex-start;
    }

    .navbar {
        position: relative;
        display: -webkit-box;
        display: -ms-flexbox;
        display: flex;
        -ms-flex-wrap: wrap;
        flex-wrap: wrap;
        -webkit-box-align: center;
        -ms-flex-align: center;
        align-items: center;
        -webkit-box-pack: justify;
        -ms-flex-pack: justify;
        justify-content: space-between;
    }

    nav {
        display: block;
    }

    .container-navbar {
        align-items: center !important;
        padding: 0.8rem 1rem;
        flex-basis: 100%;
        transition: all .3s ease;
        backface-visibility: hidden;
        min-height: calc(100% - 3.35rem);
    }
</style>