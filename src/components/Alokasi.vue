<template>
    <div>
        <Toast />
        <Loading v-model:active="loadingDialog" :is-full-page="true" :color="'#86d166'" :background-color="'black'"
            :opacity="0.75">
            <slot>
                <MyLoading></MyLoading>
            </slot>
        </Loading>
        <div class="p-col-12 p-lg-12">
            <Breadcrumb class="custom-breadcrumb" :home="home" :model="items" />
        </div>
        
        <Skeleton v-if="kegiatanOptions == null" width="97%" height="3.3rem"
            style="margin-top: 10px; margin-left: 17px; border-radius: 0.357rem; background-color: #8080802b;" />
        <Card v-else class="custom-card-matcha ccm-custom">
            <template #content>                
                <Dropdown v-model="selectedKegiatan" :options="kegiatanOptions.data" 
                    optionLabel="name" :filter="true" placeholder="Pilih Kegiatan" :showClear="true"
                    @change="getUsersKegiatan(selectedKegiatan)" style="width:100%; border: 0; padding: 10px">
                    <template #value="slotProps">
                        <div class="data-item data-item-value" v-if="slotProps.value">
                            <div>{{slotProps.value.name}}</div>
                        </div>
                        <span v-else>
                            {{slotProps.placeholder}}
                        </span>
                    </template>
                    <template #option="slotProps">
                        <div class="data-item">
                            <div>{{slotProps.option.name}}</div>
                        </div>
                    </template>
                </Dropdown>
            </template>
        </Card>  

        <!-- frame ala ala  -->
        <div class="p-grid p-jc-center pattern-bg" style="margin-top: 15px;">
            <!-- <iframe v-show="isIframeShow && !isFreshLoad" @load="loadIframe()"
                src="https://embed.lottiefiles.com/animation/106808" style="max-height:100%; overflow: auto;"
                class="p-mt-4" width="500" height="500" frameBorder="0"></iframe> -->
            <img v-show="isIframeShow && !isFreshLoad" @load="loadIframe()" src="../assets/wait.gif" class="hvr-bob mybob p-mt-1 " alt="" srcset="">
            <Skeleton v-if="!isIframeShow && isFreshLoad" width="500px" height="500px"
                style="margin-top: 37px; border-radius: 0.357rem; background-color: #8080802b;" />
        </div>

        <div v-if="this.errorMessages.length !== 0" style="text-align: center;">
            <br><br>
            <!-- <img src="../assets/matcha404.png" class="hvr-bob mybob p-mt-1 " style="width: 30%; height: 18%;" alt=""
                srcset=""> -->
            <img src="../assets/watch.gif" class="hvr-bob mybob p-mt-1 " alt="" srcset="" />
            <br>
            <h1 style="color: dimgrey; font-variant: all-petite-caps; margin-bottom: 5px;">Aww...Jangan Nangis.</h1>
            <h3 style="margin-top: 0; margin-bottom: 0;"> Ini cuma error kecil! Ayo kerja lagi</h3>
            <p style="font-style: italic; margin-top: 10px;">
                <span>So little time, so <span style="font-weight: 900;color:#78b34d"> MatchA </span> to do</span>
            </p>
            <Message v-for="(error) in this.errorMessages" v-bind:key="error" severity="error">{{error}}</Message>
        </div>

        <!-- progres alokasi -->
        <Skeleton v-show="this.onLoadData" height="180px"
            style="width: calc(100% - 30px); margin-top: 37px; border-radius: 0.357rem; background-color: #8080802b; margin-left: 15px;" />
        <div class="p-col-12 p-lg-12" style="padding-right: 25px;">
            <Card v-if="usersKegiatan !== null"
                class="custom-card-matcha animate__animated animate__fadeIn"
                style="border-radius: 0.357rem; margin-top: 15px; padding: 15px">
                <template #title>
                    <div style="text-align: center; text-transform: uppercase;">Progress</div>
                </template>
                <template #content>
                    <div class="p-grid p-jc-center ">
                        <div class="p-col-12 p-lg-3 p-md-3 p-sm-3">
                            <div style="text-align: center">
                                <span style="font-size: 40px;" v-if="this.usersKegiatan.data.summary !== null">
                                    {{this.usersKegiatan.data.summary.belum_teralokasi}} </span>
                                <br>
                                Belum Teralokasi
                            </div>
                        </div>
                        <div class="p-col-1">
                            <Divider layout="vertical" />
                        </div>
                        <div class="p-col-12 p-lg-3 p-md-3 p-sm-3">
                            <div style="text-align: center">
                                <span style="font-size: 40px;" v-if="this.usersKegiatan.data.summary !== null">
                                    {{this.usersKegiatan.data.summary.teralokasi}} </span>
                                <br>
                                Sudah Teralokasi
                            </div>
                        </div>
                        <div class="p-col-1">
                            <Divider layout="vertical" />
                        </div>
                        <div class="p-col-12 p-lg-3 p-md-3 p-sm-3">
                            <div style="text-align: center">
                                <span style="font-size: 40px;" v-if="this.usersKegiatan.data.summary !== null">
                                    {{this.tipeAlokasi == 'matching' ? this.usersKegiatan.data.summary.total_data_matching : this.usersKegiatan.data.summary.total_data_assessment }}
                                </span>
                                <br>
                                Total
                            </div>
                        </div>
                        <div class="p-col-12 p-mt-4" v-if="this.usersKegiatan.data.summary !== null">
                            <ProgressBar v-if="tipeAlokasi == 'matching'" :value="Number(((this.usersKegiatan.data.summary.teralokasi/this.usersKegiatan.data.summary.total_data_matching)*100).toFixed(2))">
                                <div style="color: white !important">{{((this.usersKegiatan.data.summary.teralokasi/this.usersKegiatan.data.summary.total_data_matching)*100).toFixed(2)}}%</div>
                            </ProgressBar>
                            <ProgressBar v-if="tipeAlokasi == 'assessment'" :value="Number(((this.usersKegiatan.data.summary.teralokasi/this.usersKegiatan.data.summary.total_data_assessment)*100).toFixed(2))">
                                <div style="color: white !important">{{((this.usersKegiatan.data.summary.teralokasi/this.usersKegiatan.data.summary.total_data_assessment)*100).toFixed(2)}}%</div>
                            </ProgressBar>
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <div class="p-col-12 p-lg-12">                        
            <div class="p-grid">
                <div class="p-col-12 p-lg-6">
                    <Skeleton v-show="this.onLoadData" height="180px"
                    style="width: calc(100% - 30px); margin-top: 37px; border-radius: 0.357rem; background-color: #8080802b; margin-left: 15px;" />
                    <DataTable v-if="users !== null && usersKegiatan !== null" :rowHover="true" :value="users.data"
                        responsiveLayout="scroll" :paginator="true" :rows="10"                        
                        :rowsPerPageOptions="[10,25,50]"
                        class="p-m-2 animate__animated animate__fadeIn"
                        style="border-radius: 0px 0px 18px 18px; box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%);">
                        <template #header>
                            <div class="p-col-12 p-grid p-jc-between"
                                style="text-transform: uppercase;">
                                Daftar User
                            </div>
                        </template>
                        <Column field="name" header="Nama"></Column>
                        <Column header="Aksi">
                            <template #body="col">
                                <Button label="Alokasi" @click="alocateSelectedUser(col)" icon="pi pi-arrow-right" />
                            </template>
                        </Column>
                    </DataTable>
                </div>

                <div class="p-col-12 p-lg-6">
                    <Skeleton v-show="this.onLoadData" height="180px"
                    style="width: calc(100% - 30px); margin-top: 37px; border-radius: 0.357rem; background-color: #8080802b; margin-left: 15px;" />
                    <DataTable v-if="usersKegiatan !== null" :value="usersKegiatan.data.alokasi"
                        responsiveLayout="scroll" :rowHover="true" :paginator="true" :rows="10"
                        :rowsPerPageOptions="[10,25,50]"
                        class="p-m-2 animate__animated animate__fadeIn"
                        style="border-radius:0px 0px 18px 18px; box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%);">
                        <template #header>
                            <div class="p-col-12 p-grid p-jc-between"
                                style="text-transform: uppercase;">
                                Daftar User Teralokasi
                                <div style="text-align: right">
                                    <Button label="Save" @click="submitAlokasiFinal()"
                                        icon="pi pi-save" :disabled="this.unsavedChanges.length > 0 ? false : true"  />
                                </div>
                            </div>
                            <div v-show="this.unsavedChanges.length">
                                <Message :closable="false" severity="warn">Unsaved changes detected: Hit <strong>SAVE</strong> button to save changes!</Message>
                            </div>
                        </template>
                        <Column field="name" header="Nama"></Column>
                        <Column field="jumlah_alokasi" header="Jumlah Alokasi"></Column>
                        <Column header="Aksi">
                            <template #body="col">
                                <Button icon="pi pi-pencil" @click="editSelectedRow(col)"
                                    class="p-button-raised p-mr-2" />
                                <Button icon="pi pi-trash" @click="deleteSelectedRowOption(col)"
                                    class="p-button-raised p-button-danger" />
                            </template>
                        </Column>

                    </DataTable>
                </div>
            </div>
        </div>

        <Dialog v-model:visible="displayAlokasiDialog" :closable="false">
            <template #header>
                <div style="width: 100%;text-align: center;font-weight: bolder;text-transform: uppercase;">Alokasi {{ this.tipeAlokasi.charAt(0).toUpperCase() + this.tipeAlokasi.slice(1) }}</div>
            </template>
            <div class="field col-12 md:col-3">
                <label for="withoutgrouping" style="font-size: smaller; color: darkgrey">Jumlah Alokasi</label> <br>
                <InputNumber @keyup.enter="submitAlokasi" style="width:100%" :min="1" :max="parseInt(this.usersKegiatan.data.summary.belum_teralokasi)"
                    id="withoutgrouping" v-model="jumlahAlokasi" mode="decimal" :useGrouping="false" autofocus />
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" @click="this.displayAlokasiDialog=false"
                    class="p-button-text" />
                <Button label="Submit" icon="pi pi-check" @click="submitAlokasi" />
            </template>
        </Dialog>

        <Dialog v-model:visible="displayEditAlokasiDialog" :closable="false">
            <template #header>
                <div style="width: 100%;text-align: center;font-weight: bolder;text-transform: uppercase;">Edit Alokasi <br/>{{selectedUser.data.name}}</div>
            </template>
            <div class="field col-12 md:col-3">
                <label style="font-size: smaller; color: darkgrey" for="withoutgrouping">Jumlah Alokasi
                    {{this.tipeAlokasi.charAt(0).toUpperCase() + this.tipeAlokasi.slice(1)}}</label> <br>
                <InputNumber autofocus style="width:100%" id="withoutgrouping" :min="1"
                    :max="parseInt(this.usersKegiatan.data.summary.belum_teralokasi)+selectedUser.data.jumlah_alokasi"
                    v-model="editedAlokasi" mode="decimal" :useGrouping="false" 
                    @keyup.enter="updateAlokasi" 
                    />
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" @click="this.displayEditAlokasiDialog=false"
                    class="p-button-text" />
                <Button label="Update" icon="pi pi-check" @click="updateAlokasi" />
            </template>
        </Dialog>

        <Dialog v-model:visible="displayDeleteAlokasiDialog" :style="{width: '450px'}" header="Hapus Data"
            class="p-fluid">

            <p>Apakah Anda yakin ingin menghapus alokasi untuk {{ selectedUser.data.name}} ? Alokasi data akan hilang
                selamanya.</p>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text"
                    @click="displayDeleteAlokasiDialog=false" />
                <Button :loading="loadingButton" label="Yes" icon="pi pi-check" class="p-button-text"
                    @click="deleteFinal()" />
            </template>
        </Dialog>

        <!-- Assessment User -->
    </div>
</template>

<script scoped>
    import DataService from '../services/DataService'
    import ProgressBar from 'primevue/progressbar';
    import Dialog from 'primevue/dialog'
    import InputNumber from 'primevue/inputnumber';
    import Breadcrumb from 'primevue/breadcrumb';
    import Toast from 'primevue/toast';
    import MyLoading from '../components/MyLoading2.vue'
    import Message from 'primevue/message'
    import Loading from 'vue-loading-overlay';
    import 'vue-loading-overlay/dist/vue-loading.css';
    import Skeleton from 'primevue/skeleton';
    export default {
        props: {
            tipeAlokasi: String,
        },
        components: {
            ProgressBar,
            Dialog,
            InputNumber,
            Breadcrumb,
            Toast,
            MyLoading,
            Loading,
            Message,
            Skeleton
        },
        data() {
            return {
                unsavedChanges: [],
                isIframeShow: false,
                isFreshLoad: true,
                onLoadData: false,
                home: {
                    icon: 'pi pi-home',
                    // to: '/'
                },
                items: [{
                        label: 'Alokasi'
                    },
                    {
                        label: this.tipeAlokasi.charAt(0).toUpperCase() + this.tipeAlokasi.slice(1)
                    },

                ],
                myShadow: '',



                selectedKegiatan: null,

                productService: null,
                users: null,
                alocatedUsers: null,
                kegiatanOptions: null,
                usersKegiatan: null,
                deletedUsers: [],
                deletedFirstAlokasiUsers: [],
                displayAlokasiDialog: false,
                displayEditAlokasiDialog: false,
                displayDeleteAlokasiDialog: false,
                jumlahAlokasi: null,
                selectedUser: null,
                editedAlokasi: null,

                //table style
                headerBg: '#ffffff',
                textColor: '#726b7c',
                loadingButton: false,
                loadingDialog: false,
                errorMessages: []
            }
        },
        async created() {
            // this.getAllUser()
            this.getListKegiatan()            
        },
        watch: {
            myCardBgColorData(newX, oldX) {
                console.log(`new ${newX}`)
                if (newX == 'mydarkcardcolor') {
                    this.headerBg = '#312d4b'
                    this.textColor = '#cfcbe4'
                } else {
                    this.headerBg = '#ffffff'
                    this.textColor = '#726b7c'
                }
                console.log(`old ${oldX}`)
            }
        },

        computed: {
            myCardBgColorData() {
                return this.$store.state.mainstyle.myCardBgColorData
            },
            myTextColorData() {
                return this.$store.state.mainstyle.myTextColorData
            }
        },
        methods: {
            async getListKegiatan() {
                try {
                    const response = await DataService.getKegiatanActiveMatchingAssessment(this.tipeAlokasi)
                    this.kegiatanOptions = response.data
                } catch (error) {
                    this.onLoadData = false
                    this.isIframeShow = true
                    this.isFreshLoad = false
                    this.toastMessage('error', 'Error!', error.message);
                }
            },
            toastMessage(type, title, message) {
                this.$toast.add({
                    severity: type,
                    summary: title,
                    detail: message,
                    life: 2000
                });
            },
            loadIframe() {
                if(this.allData == null) {
                    this.isIframeShow = true
                    this.isFreshLoad = false
                }
            },
            async getAllUser() {
                try {
                    const response = await DataService.getUsers()
                    if(response.data.meta.status == 'error') throw new Error(response.data.meta.message)
                    this.users = response.data
                    return response.data.meta.status
                } catch(error) {
                    this.onLoadData = false
                    this.errorMessages.push(error)
                    this.toastMessage('error', 'Error!', 'Something went wrong!');
                    return 'error'
                }
            },
            setDefaultCon() {
                this.errorMessages = []
                this.successMessage = null
                this.loadingDialog = false
                this.isIframeShow = false
                this.isFreshLoad = false
                this.usersKegiatan = null
                this.unsavedChanges = []
                this.deletedFirstAlokasiUsers = []
                // this.allData = null
                // this.sbrData = null
                // this.matchingData = null
            },
            async getAlokasiKegiatan(id_kegiatan, tipe_alokasi) {
                try {                    
                    const response = await DataService.getUsersKegiatan(id_kegiatan, tipe_alokasi)
                    if(response.data.meta.status == 'error') throw new Error(response.data.meta.message)
                    this.usersKegiatan = response.data
                    if (this.usersKegiatan.data.alokasi.length > 0) this.checkAvailableUser()
                    this.onLoadData = false
                    return response.data.meta.status
                } catch (error) {
                    this.onLoadData = false
                    this.errorMessages.push(error)
                    this.toastMessage('error', 'Error!', 'Something went wrong!');
                    return 'error'
                }
            },
            async getUsersKegiatan(data) {
                if(data == null) {
                    this.setDefaultCon()
                    this.isIframeShow = true
                    this.isFreshLoad = false
                    return
                }
                
                this.onLoadData = true
                this.setDefaultCon();

                const getuserStatus = await this.getAllUser()
                if(getuserStatus == 'error') return
                
                const getAlokasiKegiatanStatus = await this.getAlokasiKegiatan(data.id_kegiatan, this.tipeAlokasi)
                if(getAlokasiKegiatanStatus == 'error') return                
                
            },
            checkAvailableUser() {
                this.usersKegiatan.data.alokasi.forEach(element => {
                    var userAlokasiIndex = this.users.data.findIndex(user => user.id === element.id_user)
                    if (userAlokasiIndex > -1) {
                        this.deletedUsers.push(this.users.data[userAlokasiIndex])
                        this.users.data.splice(userAlokasiIndex, 1)
                    }
                });
            },
            alocateSelectedUser(data) {
                
                const totalDataMatching = this.tipeAlokasi == 'matching' ? this.usersKegiatan.data.summary.total_data_matching : this.usersKegiatan.data.summary.total_data_assessment
                const jumlahUser = this.users.data.length
                const jumlahUserTeralokasi = this.usersKegiatan.data.alokasi.length
                this.jumlahAlokasi = Math.floor(totalDataMatching / (jumlahUser + jumlahUserTeralokasi))
                this.selectedUser = data
                this.displayAlokasiDialog = true            
                
            },
            submitAlokasi() {

                const userTempAlokasi = {
                    id_user: this.selectedUser.data.id,
                    jumlah_alokasi: this.jumlahAlokasi,
                    name: this.selectedUser.data.name
                } 
                
                if(this.jumlahAlokasi > 0) {
                    this.unsavedChanges.push(userTempAlokasi)
                    this.usersKegiatan.data.alokasi.push(userTempAlokasi)
                    this.deletedFirstAlokasiUsers.push(this.users.data[this.selectedUser.index])
                    this.users.data.splice(this.selectedUser.index, 1)
                    this.usersKegiatan.data.summary.belum_teralokasi = this.usersKegiatan.data.summary.belum_teralokasi -
                        this.jumlahAlokasi
                    this.usersKegiatan.data.summary.teralokasi = parseInt(this.usersKegiatan.data.summary.teralokasi) + this
                        .jumlahAlokasi
                }
                
                this.displayAlokasiDialog = false
            },
            async submitAlokasiFinal() {
                this.loadingDialog = true

                const data = {
                    "id_kegiatan": this.selectedKegiatan.id_kegiatan,
                    "alokasi": this.usersKegiatan.data.alokasi
                }

                try {
                    const response = await DataService.submitAlokasi(this.selectedKegiatan.id_kegiatan, this.tipeAlokasi, data)
                    if(response.data.meta.status == 'error') throw new Error(response.data.meta.message)
                    this.toastMessage('success', 'Sukses!', response.data.meta.message);
                    this.loadingDialog = false                                        
                    this.getUsersKegiatan(this.selectedKegiatan)
                } catch(error) {
                    this.loadingDialog = false
                    this.toastMessage('error', 'Error!', error);
                }
            },
            editSelectedRow(data) {
                this.selectedUser = data
                this.editedAlokasi = data.data.jumlah_alokasi
                this.displayEditAlokasiDialog = true
            },
            updateAlokasi() {
                // console.log('update Alokasi', this.selectedUser.data)
                const foundIndex = this.usersKegiatan.data.alokasi.findIndex(element => element.id_user == this
                    .selectedUser.data.id_user);

                this.usersKegiatan.data.summary.belum_teralokasi = parseInt(this.usersKegiatan.data.summary
                        .belum_teralokasi) + parseInt(this.usersKegiatan.data.alokasi[foundIndex].jumlah_alokasi) -
                    parseInt(this.editedAlokasi)

                this.usersKegiatan.data.summary.teralokasi = parseInt(this.usersKegiatan.data.summary
                    .teralokasi) - parseInt(this.usersKegiatan.data.alokasi[foundIndex].jumlah_alokasi) + parseInt(
                    this.editedAlokasi)

                this.usersKegiatan.data.alokasi[foundIndex].jumlah_alokasi = this.editedAlokasi
                
                // untraced changes
                const unsavedChangesIndex = this.unsavedChanges.findIndex(data => data.id_user == this.selectedUser.data.id_user)
                if(unsavedChangesIndex == -1) {
                    this.unsavedChanges.push({
                        id_user: this.selectedUser.data.id_user,
                        jumlah_alokasi: this.editedAlokasi,
                        name: this.selectedUser.data.name
                    })
                } else {
                    this.unsavedChanges[unsavedChangesIndex].jumlah_alokasi = this.editedAlokasi
                }

                this.displayEditAlokasiDialog = false

            },
            deleteSelectedRowOption(data) {
                // console.log('editSelectedRow Data', data)                
                this.selectedUser = data
                this.displayDeleteAlokasiDialog = true
            },
            async deleteFinal() {
                this.loadingDialog = true

                const userIndex = this.deletedFirstAlokasiUsers.findIndex(element => element.id == this
                    .selectedUser.data.id_user);                

                if (userIndex > -1) {
                    this.users.data.push(this.deletedFirstAlokasiUsers[userIndex])
                    this.deletedFirstAlokasiUsers.splice(userIndex, 1)
                    
                    // remove untracked changes
                    const indexUnsaved = this.unsavedChanges.findIndex(data => data.id_user == this.selectedUser.data.id_user)
                    if(indexUnsaved > -1) this.unsavedChanges.splice(indexUnsaved, 1)

                    const userKegiatanIndex = this.usersKegiatan.data.alokasi.findIndex(element => element
                        .id_user == this.selectedUser.data.id_user)


                    //update summary
                    this.usersKegiatan.data.summary.belum_teralokasi = parseInt(this.usersKegiatan.data.summary
                            .belum_teralokasi) +
                        parseInt(this.usersKegiatan.data.alokasi[userKegiatanIndex].jumlah_alokasi)
                    this.usersKegiatan.data.summary.teralokasi = parseInt(this.usersKegiatan.data.summary
                        .teralokasi) - parseInt(this.usersKegiatan.data.alokasi[userKegiatanIndex]
                        .jumlah_alokasi)

                    //delete di usersKegiatan
                    this.usersKegiatan.data.alokasi.splice(userKegiatanIndex, 1)

                    this.displayDeleteAlokasiDialog = false
                    this.loadingDialog = false
                    
                } else {
                    try {
                        const response = await DataService.deleteAlokasi(this.selectedKegiatan.id_kegiatan, this.tipeAlokasi, this.selectedUser.data.id_user)
                        if(response.data.meta.status == 'error') throw new Error(response.data.meta.message)
                        this.toastMessage('success', 'Sukses!', response.data.meta.message);
                        
                        const deletedIndex = this.usersKegiatan.data.alokasi.findIndex(data => data.id_user == this.selectedUser.data.id_user)
                        this.usersKegiatan.data.summary.belum_teralokasi = parseInt(this.usersKegiatan.data.summary
                            .belum_teralokasi) + parseInt(this.usersKegiatan.data.alokasi[deletedIndex].jumlah_alokasi)
                        this.usersKegiatan.data.summary.teralokasi = parseInt(this.usersKegiatan.data.summary
                            .teralokasi) - parseInt(this.usersKegiatan.data.alokasi[deletedIndex]
                            .jumlah_alokasi)
                        if(deletedIndex > -1) this.usersKegiatan.data.alokasi.splice(deletedIndex, 1)

                        const indexUnsaved = this.unsavedChanges.findIndex(data => data.id_user == this.selectedUser.data.id_user)
                        if(indexUnsaved > -1) this.unsavedChanges.splice(indexUnsaved, 1)

                        this.displayDeleteAlokasiDialog = false
                        this.loadingDialog = false
                    } catch(error) {
                        this.toastMessage('error', 'Error!', error);
                        this.displayDeleteAlokasiDialog = false
                        this.loadingDialog = false
                    }
                }
            }
        }
    }
</script>

<style scoped>

    .pattern-bg {         
        background-position: center;
        background-size: 500px;
        background-repeat: no-repeat;
        background-image: url("data:image/svg+xml;utf8, %3Csvg width=%22100%25%22 height=%22100%25%22 viewBox=%220 0 1000 1000%22 xmlns=%22http:%2F%2Fwww.w3.org%2F2000%2Fsvg%22 %3E %3Cdefs%3E %3Cfilter id=%22grain%22 x=%22-50vw%22 y=%22-50vh%22 width=%22100vw%22 height=%22100vh%22%3E %3CfeFlood flood-color=%22%23ffffff%22 result=%22neutral-gray%22 %2F%3E %3CfeTurbulence in=%22neutral-gray%22 type=%22fractalNoise%22 baseFrequency=%222.5%22 numOctaves=%22100%22 stitchTiles=%22stitch%22 result=%22noise%22 %2F%3E %3CfeColorMatrix in=%22noise%22 type=%22saturate%22 values=%220%22 result=%22destaturatedNoise%22 %3E%3C%2FfeColorMatrix%3E %3CfeComponentTransfer in=%22desaturatedNoise%22 result=%22theNoise%22%3E %3CfeFuncA type=%22table%22 tableValues=%220 0 0.05 0%22%3E%3C%2FfeFuncA%3E %3C%2FfeComponentTransfer%3E %3CfeBlend in=%22SourceGraphic%22 in2=%22theNoise%22 mode=%22soft-light%22 result=%22noisy-image%22 %2F%3E %3C%2Ffilter%3E %3CclipPath id=%22shape%22%3E %3Cpath fill=%22currentColor%22 d=%22M891%2C606.5Q793%2C713%2C714%2C813.5Q635%2C914%2C530.5%2C820.5Q426%2C727%2C285%2C742.5Q144%2C758%2C87%2C629Q30%2C500%2C179%2C437.5Q328%2C375%2C376.5%2C321.5Q425%2C268%2C518%2C213Q611%2C158%2C638.5%2C268.5Q666%2C379%2C827.5%2C439.5Q989%2C500%2C891%2C606.5Z%22%3E%3C%2Fpath%3E %3C%2FclipPath%3E %3C%2Fdefs%3E %3Cg filter=%22url(%23grain)%22 clip-path=%22url(%23shape)%22%3E %3Cpath fill=%22%23f0f0f0%22 d=%22M891%2C606.5Q793%2C713%2C714%2C813.5Q635%2C914%2C530.5%2C820.5Q426%2C727%2C285%2C742.5Q144%2C758%2C87%2C629Q30%2C500%2C179%2C437.5Q328%2C375%2C376.5%2C321.5Q425%2C268%2C518%2C213Q611%2C158%2C638.5%2C268.5Q666%2C379%2C827.5%2C439.5Q989%2C500%2C891%2C606.5Z%22 %2F%3E %3C%2Fg%3E %3C%2Fsvg%3E");

    }

    .pattern-bg-2 {
        background-position: top;
        background-size: 500px;
        background-repeat: no-repeat;
        /* background-image: url("data:image/svg+xml;utf8, %3Csvg width=%22100%25%22 height=%22100%25%22 viewBox=%220 0 1000 1000%22 xmlns=%22http:%2F%2Fwww.w3.org%2F2000%2Fsvg%22 %3E %3Cdefs%3E %3Cfilter id=%22grain%22 x=%22-50vw%22 y=%22-50vh%22 width=%22100vw%22 height=%22100vh%22%3E %3CfeFlood flood-color=%22%23ffffff%22 result=%22neutral-gray%22 %2F%3E %3CfeTurbulence in=%22neutral-gray%22 type=%22fractalNoise%22 baseFrequency=%222.5%22 numOctaves=%22100%22 stitchTiles=%22stitch%22 result=%22noise%22 %2F%3E %3CfeColorMatrix in=%22noise%22 type=%22saturate%22 values=%220%22 result=%22destaturatedNoise%22 %3E%3C%2FfeColorMatrix%3E %3CfeComponentTransfer in=%22desaturatedNoise%22 result=%22theNoise%22%3E %3CfeFuncA type=%22table%22 tableValues=%220 0 0.05 0%22%3E%3C%2FfeFuncA%3E %3C%2FfeComponentTransfer%3E %3CfeBlend in=%22SourceGraphic%22 in2=%22theNoise%22 mode=%22soft-light%22 result=%22noisy-image%22 %2F%3E %3C%2Ffilter%3E %3CclipPath id=%22shape%22%3E %3Cpath fill=%22currentColor%22 d=%22M777.5%2C609Q801%2C718%2C693%2C739.5Q585%2C761%2C476.5%2C833.5Q368%2C906%2C256.5%2C832Q145%2C758%2C150%2C629Q155%2C500%2C226%2C426Q297%2C352%2C325%2C199.5Q353%2C47%2C489%2C81Q625%2C115%2C763%2C162Q901%2C209%2C827.5%2C354.5Q754%2C500%2C777.5%2C609Z%22%3E%3C%2Fpath%3E %3C%2FclipPath%3E %3C%2Fdefs%3E %3Cg filter=%22url(%23grain)%22 clip-path=%22url(%23shape)%22%3E %3Cpath fill=%22%23f0f0f0%22 d=%22M777.5%2C609Q801%2C718%2C693%2C739.5Q585%2C761%2C476.5%2C833.5Q368%2C906%2C256.5%2C832Q145%2C758%2C150%2C629Q155%2C500%2C226%2C426Q297%2C352%2C325%2C199.5Q353%2C47%2C489%2C81Q625%2C115%2C763%2C162Q901%2C209%2C827.5%2C354.5Q754%2C500%2C777.5%2C609Z%22 %2F%3E %3C%2Fg%3E %3C%2Fsvg%3E"); */
        background-image: url("data:image/svg+xml;utf8, %3Csvg width=%22100%25%22 height=%22100%25%22 viewBox=%220 0 1000 1000%22 xmlns=%22http:%2F%2Fwww.w3.org%2F2000%2Fsvg%22 %3E %3Cdefs%3E %3Cfilter id=%22grain%22 x=%22-50vw%22 y=%22-50vh%22 width=%22100vw%22 height=%22100vh%22%3E %3CfeFlood flood-color=%22%23ffffff%22 result=%22neutral-gray%22 %2F%3E %3CfeTurbulence in=%22neutral-gray%22 type=%22fractalNoise%22 baseFrequency=%222.5%22 numOctaves=%22100%22 stitchTiles=%22stitch%22 result=%22noise%22 %2F%3E %3CfeColorMatrix in=%22noise%22 type=%22saturate%22 values=%220%22 result=%22destaturatedNoise%22 %3E%3C%2FfeColorMatrix%3E %3CfeComponentTransfer in=%22desaturatedNoise%22 result=%22theNoise%22%3E %3CfeFuncA type=%22table%22 tableValues=%220 0 0.05 0%22%3E%3C%2FfeFuncA%3E %3C%2FfeComponentTransfer%3E %3CfeBlend in=%22SourceGraphic%22 in2=%22theNoise%22 mode=%22soft-light%22 result=%22noisy-image%22 %2F%3E %3C%2Ffilter%3E %3CclipPath id=%22shape%22%3E %3Cpath fill=%22currentColor%22 d=%22M854.5%2C644.5Q898%2C789%2C740%2C771Q582%2C753%2C475.5%2C828.5Q369%2C904%2C235.5%2C846.5Q102%2C789%2C168.5%2C644.5Q235%2C500%2C185.5%2C368Q136%2C236%2C277%2C241.5Q418%2C247%2C522%2C180Q626%2C113%2C728.5%2C186.5Q831%2C260%2C821%2C380Q811%2C500%2C854.5%2C644.5Z%22%3E%3C%2Fpath%3E %3C%2FclipPath%3E %3C%2Fdefs%3E %3Cg filter=%22url(%23grain)%22 clip-path=%22url(%23shape)%22%3E %3Cpath fill=%22%23f0f0f0%22 d=%22M854.5%2C644.5Q898%2C789%2C740%2C771Q582%2C753%2C475.5%2C828.5Q369%2C904%2C235.5%2C846.5Q102%2C789%2C168.5%2C644.5Q235%2C500%2C185.5%2C368Q136%2C236%2C277%2C241.5Q418%2C247%2C522%2C180Q626%2C113%2C728.5%2C186.5Q831%2C260%2C821%2C380Q811%2C500%2C854.5%2C644.5Z%22 %2F%3E %3C%2Fg%3E %3C%2Fsvg%3E");
    }

    ::v-deep(.p-card-body) {
        padding: 0 !important;
    }

    ::v-deep(.p-card-content) {
        padding: 0 !important;
    }

    ::v-deep(.p-dropdown:not(.p-disabled).p-focus) {
        box-shadow: none !important;
    }
    .ccm-custom {
        margin-left: 15px;
        width: calc(100% - 30px);
    } 

    ::v-deep(thead th) {
        background-color: #f3f2f7 !important;
        vertical-align: top;
        text-transform: uppercase;
        font-size: .857rem;
        letter-spacing: .5px;
        text-align: center !important;
    }
    
    /* td {
        background-color: v-bind(headerBg);
        color: v-bind(textColor);
    }

    .p-datatable .p-datatable-header {
        background: none;
        color: none;
        border: none;
    }

    .p-datatable-thead {
        background-color: v-bind(headerBg);
        color: v-bind(textColor);
    }

    .p-paginator {
        background-color: v-bind(headerBg);
        color: v-bind(textColor);
    }

    .p-dropdown-label {
        background-color: v-bind(headerBg);
        color: v-bind(textColor);
    }

    .buttonCompareActive {
        background-color: #9155fd;
        color: white;
    }

    .buttonDataSourceActive {
        background-color: #9155fd;
        color: white;
    }

    :host>>>.p-tabmenu .p-tabmenu-nav .p-tabmenuitem.p-state-active {
        background-color: #d90096;
        border: 1px solid #d600d9;
    }

    :host>>>.p-tabview .p-tabview-panels {
        background-color: red;
    } */

    /* .p-datatable-wrapper { */
        /* border-radius: 0px 0px 18px 18px; */
    /* } */

    /* .p-datatable-header {
        border-radius: 18px 18px 0px 0px;
    } */

    /* .p-progressbar .p-progressbar-label {
        color: white;
        line-height: 1.5rem;
    }

    nav {
        background-color: v-bind(headerBg) !important;
        color: v-bind(textColor) !important;
    }

    .p-menuitem-text {
        color: v-bind(textColor) !important;
    }

    .p-breadcrumb ul li.p-breadcrumb-chevron {
        color: v-bind(textColor) !important;
    }

    .p-breadcrumb ul li .p-menuitem-link .p-menuitem-icon {
        color: v-bind(textColor) !important;
    }

    .p-dropdown .p-dropdown-label .p-placeholder {
        color: v-bind(textColor) !important;
    } */

    /* Bob */
    /* @-webkit-keyframes hvr-bob {
        0% {
            -webkit-transform: translateY(-14px);
            transform: translateY(-14px);
        }

        50% {
            -webkit-transform: translateY(-4px);
            transform: translateY(-4px);
        }

        100% {
            -webkit-transform: translateY(-14px);
            transform: translateY(-14px);
        }
    }

    @keyframes hvr-bob {
        0% {
            -webkit-transform: translateY(-14px);
            transform: translateY(-14px);
        }

        50% {
            -webkit-transform: translateY(-4px);
            transform: translateY(-4px);
        }

        100% {
            -webkit-transform: translateY(-14px);
            transform: translateY(-14px);
        }
    }

    @-webkit-keyframes hvr-bob-float {
        100% {
            -webkit-transform: translateY(-14px);
            transform: translateY(-14px);
        }
    }

    @keyframes hvr-bob-float {
        100% {
            -webkit-transform: translateY(-14px);
            transform: translateY(-14px);
        }
    }

    .hvr-bob {
        display: inline-block;
        vertical-align: middle;
        -webkit-transform: perspective(1px) translateZ(0);
        transform: perspective(1px) translateZ(0);
        box-shadow: 0 0 1px rgba(0, 0, 0, 0);
    } */

    /* .hvr-bob,
    .hvr-bob,
    .hvr-bob {
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


    /* .p-tabmenu{
  background-color: aqua;
}

.p-tabmenuitem{
  background-color: red;

}
.p-highlight{
  background-color: red !important;background: red;
}
.p-tabmenu-nav{
  background-color: red !important;background: red !important;
}
.p-menuitem-text{
  background-color: red !important;background: red;
} */
    /* .ul{
  background-color: red;
} */
</style>