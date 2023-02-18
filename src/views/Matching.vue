<template>
    <div>
        <Toast />
        <div :class="'p-col-12 p-lg-12' ">
            <Breadcrumb class="custom-breadcrumb" :home="home" :model="items" />
        </div>

        <Skeleton v-if="kegiatanOptions == null" width="97%" height="3.3rem"
            style="margin-top: 10px; margin-left: 17px; border-radius: 0.357rem; background-color: #8080802b;" />
        <Card v-else class="custom-card-matcha ccm-custom">
            <template #content>                
                <Dropdown v-model="selectedKegiatan" :options="kegiatanOptions.data"
                    optionLabel="name" :filter="true" placeholder="Pilih Kegiatan" :showClear="true"
                    @change="getKegiatanData(selectedKegiatan)" style="width:100%; border: 0; padding: 10px">
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
        <div class="pattern-bg-2" v-if="this.successMessage !== null" style="text-align: center;">
            <br>
            <!-- <img src="../assets/matcha.png" class="hvr-bob mybob p-mt-1 " style="width: 30%; height: 18%;" alt="" srcset=""> -->
            <img src="../assets/done.gif" class="hvr-bob mybob p-mt-1 " alt="" srcset="">
            <br>
            <h1 style="color: dimgrey; font-variant: all-petite-caps; margin-bottom: 5px;">Selamat! Kamu sudah selesai Matching</h1>
            <h3 style="margin-top: 0; margin-bottom: 0;"> Ayo kerja lagi.</h3>
            <p style="font-style: italic; margin-top: 10px;">
                <span>So little time, so <span style="font-weight: 900;color:#78b34d"> MatchA </span> to do</span>
            </p>
        </div>
        <div v-if="this.errorMessages.length !== 0" style="text-align: center;">
            <br><br>
            <!-- <img src="../assets/matcha404.png" class="hvr-bob mybob p-mt-1 " style="width: 30%; height: 18%;" alt=""
                srcset=""> -->
                <img src="../assets/watch.gif" class="hvr-bob mybob p-mt-1 " alt="" srcset="" />
            <br>
            <h1 style="color: dimgrey; font-variant: all-petite-caps; margin-bottom: 5px;">Aww...Jangan Nangis.</h1>
            <h3 style="margin-top: 0; margin-bottom: 0;">Ini cuma error kecil! Ayo kerja lagi.</h3>
            <p style="font-style: italic; margin-top: 10px;">
                <span>So little time, so <span style="font-weight: 900;color:#78b34d"> MatchA </span> to do</span>
            </p>
            <Message v-for="(error) in this.errorMessages" v-bind:key="error" severity="error">{{error}}</Message>
        </div>

        <!-- progres matching user -->
        <Skeleton v-show="this.onLoadData" height="180px"
            style="width: calc(100% - 30px); margin-top: 37px; border-radius: 0.357rem; background-color: #8080802b; margin-left: 15px;" />
        <div class="p-col-12 p-lg-12" style="padding-right: 25px;">
            <Card v-if="this.allData !== null" class="custom-card-matcha animate__animated animate__fadeIn"
                style="border-radius: 0.357rem; margin-top: 15px; padding: 15px">
                <template #title>
                    <div style="text-align: center; text-transform: uppercase;">Progress</div>
                </template>
                <template #content>
                    <div class="p-grid p-jc-center " style=" border-left-color: red; ">
                        <div class="p-col-12 p-lg-3 p-md-3 p-sm-3">
                            <div style="text-align: center">
                                <span style="font-size: 40px;"> {{this.allData.data.summary.belum_matching}} </span>
                                <br>
                                Belum Matching
                            </div>
                        </div>
                        <div class="p-col-1">
                            <Divider layout="vertical" />
                        </div>
                        <div class="p-col-12 p-lg-3 p-md-3 p-sm-3">
                            <div style="text-align: center">
                                <span style="font-size: 40px;"> {{this.allData.data.summary.sudah_matching}} </span>
                                <br>
                                <a @click="showMatchingResult()" href="javascript:void(0)" v-tooltip.bottom="'Klik untuk melihat hasil matching!'">Sudah Matching</a>
                            </div>
                        </div>
                        <div class="p-col-1">
                            <Divider layout="vertical" />
                        </div>
                        <div class="p-col-12 p-lg-3 p-md-3 p-sm-3">
                            <div style="text-align: center">
                                <span style="font-size: 40px;"> {{this.allData.data.summary.total_data_matching}}
                                </span>
                                <br>
                                Total
                            </div>
                        </div>
                        <div class="p-col-12 p-mt-4">
                            <ProgressBar :value="Number(progresMatching)">
                                <div style="color: white !important">{{progresMatching}}%</div>
                            </ProgressBar>
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <div v-show="this.onLoadData" class="p-col-12 p-grid p-jc-between" style="padding-left:15px">
            <Skeleton width="44%" height="50px" style="margin-top: 25px; border-radius: 0.357rem; background-color: #8080802b; margin-left: 10px;" />
            <Skeleton width="44%" height="50px" style="margin-top: 25px; border-radius: 0.357rem; background-color: #8080802b;" />
        </div>
        
        <div v-if="this.sbrData !== null" class="p-col-12 p-grid p-jc-between p-m-2 p-p-2"
            style="margin-left:10px !important; padding-right: 22px !important;">
            <div class="p-col">
                <Button style="font-weight: 900;border-radius: 0.357rem; width: 45%" label="Skip" icon="pi pi-forward"
                class="p-button p-button-danger p-jc-center p-ripple p-button-lg onclick-btn-custom" @click="ignore()">
                    <i class="pi pi-forward p-mr-2"></i> IGNORE
                </Button>

                <Button style="margin-left: 10px; font-weight: 900;border-radius: 0.357rem; width: 45%" label="Skip" icon="pi pi-forward"
                    class="p-button-outlined p-button-danger p-jc-center p-ripple p-button-lg onclick-btn-custom" @click="skip()">
                    <i class="pi pi-forward p-mr-2"></i> SKIP
                </Button>
            </div>
            <div class="p-col">
                <Button icon="pi pi-send" iconPos="left" label="SUBMIT" :badge="this.selectedData.length.toString()" style="font-weight:900;border-radius: 0.357rem; width:100%; background: #948bf4 !important; display: inline-block;"
                class="p-col-12 p-lg-6 p-jc-center p-ripple p-button-lg onclick-btn-custom submit-btn-matcha"
                @click="submit()" />
            </div>
                
        </div>

        <Skeleton v-show="this.onLoadData" height="180px"
            style="width: calc(100% - 30px); margin-top: 37px; border-radius: 0.357rem; background-color: #8080802b; margin-left: 15px;" />
        <DataTable style="box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%);" 
            v-if="this.matchingData !== null"
            :frozenValue="lockedData" :value="this.matchingData"
            v-model:filters="filters" filterDisplay="menu" :scrollable="true"
            showGridlines :paginator="false"
            responsiveLayout="scroll" :rowHover="true" dataKey="id"
            class="p-datatable-sm p-m-2 animate__animated animate__fadeIn"
            :globalFilterFields="['nama_perusahaan','alamat','kode_provinsi','kode_kabupaten_kota','kode_kecamatan','kode_kelurahan_desa','nomor_telepon','aktivitas_perusahaan','kbli_aktivitas']">
            <template #empty>
                <h5>Data tidak tersedia!</h5>
            </template>
            <template #loading>
                Mohon menunggu;
            </template>
            <template #header>
                <div class="flex justify-content-between" style="text-align: right">
                    <span class="p-input-icon-left">
                        <i class="pi pi-search" />
                        <InputText id="filter-perusahaan" tabindex="-1" type="text" v-model="filters['global'].value" placeholder="Keyword Search" autofocus="true"/>
                    </span>
                </div>

            </template>

            <Column header="Select" style="min-width:60px">
                <template #body="slotProps">
                    <div v-if="!slotProps.frozenRow" class="p-d-flex p-jc-center p-ai-center ">
                        <Checkbox :id="slotProps.index" class="p-ml-4" v-model="selectedData" name="matching-value" :value="slotProps.data.idsbr" />
                    </div>
                    <div v-else class="frozenRowBg">
                    </div>
                </template>
            </Column>

            <Column field="skor_kalo" header="Skor" style="min-width:60px">
                <template #body="col">
                    <div v-if="!col.frozenRow"
                        @click="udpateSelectedMatch(col.data.idsbr)">
                        {{col.data.skor_kalo}}
                    </div>
                    <div v-else class="frozenRowBg">
                    </div>
                </template>
            </Column>
            <Column field="nama_perusahaan" header="Nama Perusahaan" style="min-width:160px">
                <template #body="col">
                    <div v-if="!col.frozenRow"
                        :class="isDataEqual(this.sbrData['nama_perusahaan'], col.data.nama_perusahaan) ? 'bgMatched': ''"
                        @click="udpateSelectedMatch(col.data.idsbr)">
                        {{col.data.nama_perusahaan}}
                    </div>
                    <div v-if="col.frozenRow" class="frozenRowBg">
                        {{col.data.nama_perusahaan}}
                    </div>

                </template>
            </Column>
            <Column field="alamat" header="Alamat" style="min-width:200px">
                <template #body="col">
                    <div v-if="!col.frozenRow"
                        :class="isDataEqual(this.sbrData['alamat'], col.data.alamat) ? 'bgMatched' : ''" 
                        @click="udpateSelectedMatch(col.data.idsbr)">
                        {{col.data.alamat}}

                    </div>
                    <div v-if="col.frozenRow" class="frozenRowBg">
                        {{col.data.alamat}}
                    </div>
                </template>
            </Column>
            <Column field="kode_provinsi" header="Kode Provinsi" style="min-width:100px">
                <template #body="col">

                    <div :class="isDataEqual(this.sbrData['kode_provinsi'], col.data.kode_provinsi) ? 'bgMatched': ''"
                        v-if="!col.frozenRow" v-tooltip.bottom="col.data.nama_provinsi"
                        @click="udpateSelectedMatch(col.data.idsbr)">
                        {{col.data.kode_provinsi}}
                    </div>

                    <div v-if="col.frozenRow" v-tooltip.bottom="col.data.nama_provinsi" class="frozenRowBg">
                        {{col.data.kode_provinsi}}
                    </div>

                </template>
            </Column>
            <Column field="kode_kabupaten_kota" header="Kode Kabupaten / Kota" style="min-width:100px">
                <template #body="col">
                    <div :class="isDataEqual(this.sbrData['kode_kabupaten_kota'], col.data.kode_kabupaten_kota) ? 'bgMatched': ''"
                        v-if="!col.frozenRow" v-tooltip.bottom="col.data.nama_kabupaten_kota"
                        @click="udpateSelectedMatch(col.data.idsbr)">
                        {{col.data.kode_kabupaten_kota}}

                    </div>

                    <div v-if="col.frozenRow" v-tooltip.bottom="col.data.nama_kabupaten_kota" class="frozenRowBg">
                        {{col.data.kode_kabupaten_kota}}
                    </div>

                </template>
            </Column>
            <Column field="kode_kecamatan" header="Kode Kecamatan" style="min-width:120px">
                <template #body="col">
                    <div :class="isDataEqual(this.sbrData['kode_kecamatan'], col.data.kode_kecamatan) ? 'bgMatched': ''"
                        v-if="!col.frozenRow" v-tooltip.bottom="col.data.nama_kecamatan"
                        @click="udpateSelectedMatch(col.data.idsbr)">
                        {{col.data.kode_kecamatan}}
                    </div>

                    <div v-if="col.frozenRow" v-tooltip.bottom="col.data.nama_kecamatan" class="frozenRowBg">
                        {{col.data.kode_kecamatan}}
                    </div>
                </template>
            </Column>
            <Column field="kode_kelurahan_desa" header="Kode Kelurahan / Desa" style="min-width:100px">
                <template #body="col">

                    <div :class="isDataEqual(this.sbrData['kode_kelurahan_desa'], col.data.kode_kelurahan_desa) ? 'bgMatched' : ''"
                        v-if="!col.frozenRow" v-tooltip.bottom="col.data.nama_kelurahan_desa"
                        @click="udpateSelectedMatch(col.data.idsbr)">
                        {{col.data.kode_kelurahan_desa}}

                    </div>

                    <div v-if="col.frozenRow" v-tooltip.bottom="col.data.nama_kelurahan_desa" class="frozenRowBg">
                        {{col.data.kode_kelurahan_desa}}
                    </div>


                </template>
            </Column>
            <Column field="nomor_telepon" header="No Telepon" style="min-width:140px">
                <template #body="col">

                    <div :class="isDataEqual(this.sbrData['nomor_telepon'], col.data.nomor_telepon) ? 'bgMatched' : ''"
                        v-if="!col.frozenRow"
                        @click="udpateSelectedMatch(col.data.idsbr)">
                        {{col.data.nomor_telepon}}

                    </div>
                    <div v-if="col.frozenRow" class="frozenRowBg">
                        {{col.data.nomor_telepon}}
                    </div>
                </template>
            </Column>
            <Column field="aktivitas_perusahaan" header="Aktivitas Perusahaan" style="min-width:200px">
                <template #body="col">

                    <div :class="isDataEqual(this.sbrData['aktivitas_perusahaan'], col.data.aktivitas_perusahaan) ? 'bgMatched' : ''"
                        v-if="!col.frozenRow"
                        @click="udpateSelectedMatch(col.data.idsbr)">
                        {{col.data.aktivitas_perusahaan}}

                    </div>

                    <div v-if="col.frozenRow" class="frozenRowBg">
                        {{col.data.aktivitas_perusahaan}}
                    </div>
                </template>
            </Column>
            <Column field="kbli_aktivitas" header="Kode KBLI" style="min-width:100px">
                <template #body="col">

                    <div :class="isDataEqual(this.sbrData['kbli_aktivitas'], col.data.kbli_aktivitas) ? 'bgMatched' : ''"
                        v-if="!col.frozenRow"
                        @click="udpateSelectedMatch(col.data.idsbr)">
                        {{col.data.kbli_aktivitas}}

                    </div>

                    <div v-if="col.frozenRow" class="frozenRowBg">
                        {{col.data.kbli_aktivitas}}
                    </div>
                </template>
            </Column>

        </DataTable>

        <Loading v-model:active="loadingDialog" :is-full-page="true" :color="'#86d166'" :background-color="'black'"
            :opacity="0.75">
            <slot>
                <MyLoading></MyLoading>
            </slot>
        </Loading>        

        <ConfirmDialog></ConfirmDialog>

        <Dialog header="Hasil Matching" stripedRows v-model:visible="displayDialogResultMatching" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}" :maximizable="true" :modal="true">
            <DataTable :value="dataMatchingResult" :paginator="true" :rows="10" 
                v-model:filters="filters2" filterDisplay="menu" 
                dataKey="id"
                :globalFilterFields="['nama_perusahaan','alamat','date_matching']"
                responsiveLayout="scroll">
                <template #header>
                    <div class="flex justify-content-between" style="text-align: right">                        
                        <span class="p-input-icon-left">
                            <i class="pi pi-search" />
                            <InputText v-model="filters2['global'].value" placeholder="Keyword Search" />
                        </span>
                    </div>
                </template>
                <template #empty>
                    Data tidak tersedia!
                </template>
                <Column field="nama_perusahaan" header="Nama"></Column>
                <Column field="alamat" header="Alamat"></Column>
                <Column field="date_matching" header="Tanggal Matching"></Column>
                <Column field="hasil_matching" header="Result"></Column>
                <Column header="Action">
                    <template #body="slotProps">   
                        <div>
                            <Button v-tooltip.bottom="'Klik untuk melihat hasil matching!'" v-if="slotProps.data.hasil_matching == 'MATCH'" class="p-button-info p-button-sm" @click="openHasilMatchingTerpilih(slotProps.data.id_spool)" label="View" icon="pi pi-circle" />
                            <Button v-tooltip.bottom="'Klik untuk membatalkan hasil matching!'" v-if="slotProps.data.hasil_matching == 'UNMATCH'" class="p-button-danger p-button-sm" @click="cancelUnmatch(slotProps.data.id_spool)" label="Cancel" icon="pi pi-times" />
                        </div>                                             
                    </template>
                </Column>
            </DataTable>            
            <template #footer>
                <Button label="Close" @click="this.displayDialogResultMatching = false" />                
            </template>
        </Dialog>

        <Dialog header="Detail Hasil Matching" v-model:visible="modalHasilMatching" :breakpoints="{'960px': '75vw', '640px': '90vw'}" :style="{width: '50vw'}" :modal="true">
            <BlockUI :blocked="blockedPanel">
                <p class="m-0" style="border: 1px solid #d1ecd1;padding: 10px;border-radius: 0.5em;background-color: #d1ecd1;color: gray;">
                    Nama: <strong>{{ this.detailMatchingNama }}</strong> <br/>
                    Alamat: <strong>{{ this.detailMatchingAlamat }}</strong>
                </p>
                <div style="text-align: right; margin-bottom: 15px">
                    <Button @click="cancelAllMatching(this.selectedSpool)" v-tooltip.bottom="'Klik untuk membatalkan semua hasil matching!'" class="p-button-danger p-button-sm" label="Cancel All" icon="pi pi-times" />
                </div>
                <DataTable :value="dataDetailMatchingResult" :paginator="true" :rows="10" responsiveLayout="scroll">
                    <template #empty>
                        Data tidak tersedia!
                    </template>
                    <Column field="result_nama" header="Nama"></Column>
                    <Column field="result_alamat" header="Alamat"></Column>
                    <Column header="Action">
                        <template #body="slotProps">   
                            <div>
                                <Button v-tooltip.bottom="'Klik untuk membatalkan hasil matching!'" class="p-button-danger p-button-sm" @click="cancelMatching(slotProps.data.result_id, slotProps.data.id_spool, slotProps.data.idsbr)" label="Cancel" icon="pi pi-times" />
                            </div>                                             
                        </template>
                    </Column>
                </DataTable>
            </BlockUI>            
            <template #footer>
                <Button label="Close" @click="this.modalHasilMatching = false" />
            </template>
        </Dialog>

    </div>
</template>

<script>
    import DataService from '../services/DataService'
    import Toast from 'primevue/toast';
    import Checkbox from 'primevue/checkbox';
    import ProgressBar from 'primevue/progressbar';
    import Tooltip from 'primevue/tooltip'
    import ConfirmDialog from 'primevue/confirmdialog';
    import {
        FilterMatchMode,
    } from 'primevue/api';
    import InputText from 'primevue/inputtext';
    import Breadcrumb from 'primevue/breadcrumb';
    import Message from 'primevue/message'
    import Dialog from 'primevue/dialog';
    import MyLoading from '../components/MyLoading2.vue'
    import BlockUI from 'primevue/blockui';

    import Loading from 'vue-loading-overlay';
    import 'vue-loading-overlay/dist/vue-loading.css';

    import Skeleton from 'primevue/skeleton';

    export default {
        name: 'CompareTable',
        directives: {
            'tooltip': Tooltip
        },
        components: {
            Toast,
            Checkbox,
            ProgressBar,
            InputText,
            Breadcrumb,
            Message,
            MyLoading,
            Loading,
            Skeleton,
            ConfirmDialog,
            Dialog,
            BlockUI
        },
        data() {
            return {
                selectedSpool: null,
                modalHasilMatching: false,
                dataMatchingResult: null,
                displayDialogResultMatching: false,
                selectedMatching: null,
                progresMatching: 0,
                isIframeShow: false,
                isFreshLoad: true,
                onLoadData: false,
                home: {
                    icon: 'pi pi-home',
                    to: '/'
                },
                items: [{
                        label: 'Matching',
                        to: '/matching'
                    },

                ],
                filters: {
                    'global': {
                        value: null,
                        matchMode: FilterMatchMode.CONTAINS
                    },
                },
                filters2: {
                    'global': {
                        value: null,
                        matchMode: FilterMatchMode.CONTAINS
                    },
                },
                lockedData: [{
                    id_perusahaan: "",
                    idsbr: "",
                    nama_perusahaan: "",
                    nama_komersial: "",
                    alamat: "",
                    skor_matching: "",
                    rank_nama: "",
                    rank_alamat: "",
                    skor_kalo: "",
                    kode_pos: "",
                    nomor_telepon: "",
                    kbli_aktivitas: "",
                    provinsi_id: "",
                    nama_provinsi: "",
                    kode_provinsi: "",
                    kabupaten_kota_id: "",
                    nama_kabupaten_kota: " ",
                    kode_kabupaten_kota: "",
                    kecamatan_id: "",
                    nama_kecamatan: " ",
                    kode_kecamatan: "",
                    kelurahan_desa_id: "",
                    nama_kelurahan_desa: " ",
                    kode_kelurahan_desa: ""
                }],

                // lockedData: null, 
                loadingDialog: false,
                allData: null,
                sbrData: null,
                matchingData: null,
                selectedKegiatan: null,
                kegiatanOptions: null,
                selectedData: [],
                //error
                errorMessages: [],
                successMessage: null,
                dataDetailMatchingResult: null,
                detailMatchingNama: '',
                detailMatchingAlamat: '',
                blockedPanel: true
            }
        },
        created() {
            this.getListKegiatan()            
        },
        computed: {
            currentUser() {
                return this.$store.state.auth.user
            }
        },
        watch: {},
        methods: {
            cancelAllMatching(idspool) {
                this.$confirm.require({
                    message: 'Batalkan semua hasil matching ('+this.dataDetailMatchingResult.length+') ?',
                    header: 'Konfirmasi',
                    icon: 'pi pi-exclamation-triangle',
                    accept: async () => {
                        this.loadingDialog = true
                        this.modalHasilMatching = false
                        try {
                            const result = await DataService.cancelAllMatching(idspool, this.selectedKegiatan.id_kegiatan, this.currentUser.id)
                            if(result.data.meta.status == 'error') {
                                this.loadingDialog = false
                                this.toastMessage('error', 'Error!', 'Something went wrong!'); 
                                return;
                            }
                            this.loadingDialog = false
                            this.toastMessage('success', 'Sukses!', 'Berhasil membatalkan hasil matching!');
                            let tempIndex = this.dataMatchingResult.findIndex((data) => data.id_spool == idspool)
                            if(tempIndex != -1) {
                                this.dataMatchingResult.splice(tempIndex, 1)
                                this.allData.data.summary.belum_matching += 1
                                this.allData.data.summary.sudah_matching -= 1
                                this.calculateProgres()
                            } 
                        } catch (error) {
                            console.log(error)
                            this.modalHasilMatching = false
                            this.loadingDialog = false
                            this.toastMessage('error', 'Error!', 'Something went wrong!');
                        }
                    },
                    reject: () => {
                        // this.$toast.add({severity:'error', summary:'Rejected', detail:'You have rejected', life: 3000});
                    }
                });
            },
            cancelUnmatch(idspool) {
                this.$confirm.require({
                    message: 'Batalkan hasil matching ini ?',
                    header: 'Konfirmasi',
                    icon: 'pi pi-exclamation-triangle',
                    accept: async () => {
                        this.loadingDialog = true
                        try {
                            const result = await DataService.cancelMatchingResult(idspool, null, this.selectedKegiatan.id_kegiatan, this.currentUser.id);
                            if(result.data.meta.status == 'error') {
                                this.loadingDialog = false
                                this.toastMessage('error', 'Error!', 'Something went wrong!'); 
                                return;
                            }
                            this.loadingDialog = false
                            this.modalHasilMatching = false
                            this.toastMessage('success', 'Sukses!', 'Berhasil membatalkan hasil matching!');
                            let tempIndex = this.dataMatchingResult.findIndex((data) => data.id_spool == idspool)
                            if(tempIndex != -1) {
                                this.dataMatchingResult.splice(tempIndex, 1)
                                this.allData.data.summary.belum_matching += 1
                                this.allData.data.summary.sudah_matching -= 1
                                this.calculateProgres()
                            }                             
                        } catch(error) {
                            console.log(error)
                            this.loadingDialog = false
                            this.toastMessage('error', 'Error!', 'Something went wrong!');
                        }
                    },
                    reject: () => {
                        // this.$toast.add({severity:'error', summary:'Rejected', detail:'You have rejected', life: 3000});
                    }
                });
            },
            cancelMatching(idbp, idspool, idsbr) {
                this.$confirm.require({
                    message: 'Batalkan hasil matching ini ?',
                    header: 'Konfirmasi',
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => {
                        this.loadingDialog = true
                        this.modalHasilMatching = false
                        this.doCancelMatchingResult(idspool, idsbr)
                    },
                    reject: () => {
                        // this.$toast.add({severity:'error', summary:'Rejected', detail:'You have rejected', life: 3000});
                    }
                });
            },
            async doCancelMatchingResult(idspool, idsbr) {
                try {                    
                    const result = await DataService.cancelMatchingResult(idspool, idsbr, this.selectedKegiatan.id_kegiatan, this.currentUser.id);
                    if(result.data.meta.status == 'error') {
                        this.loadingDialog = false
                        this.toastMessage('error', 'Error!', 'Data kegiatan tidak ditemukan!'); 
                        return;
                    }
                    this.loadingDialog = false
                    this.toastMessage('success', 'Sukses!', 'Berhasil membatalkan hasil matching!');
                    this.modalHasilMatching = false
                    // kalau sisa hasil matching = 0 -> abis, update tampilan modal matching result ..
                    if(result.data.data.sisa == 0) {
                        let tempIndex = this.dataMatchingResult.findIndex((data) => data.id_spool == idspool)
                        if(tempIndex != -1) {
                            this.dataMatchingResult.splice(tempIndex, 1)
                            this.allData.data.summary.belum_matching += 1
                            this.allData.data.summary.sudah_matching -= 1
                            this.calculateProgres()
                        }    
                    }
                } catch (error) {
                    console.log(error)
                    this.loadingDialog = false
                    this.toastMessage('error', 'Error!', 'Something went wrong!');
                }
            },
            calculateProgres() {
                this.progresMatching = ((this.allData.data.summary.sudah_matching / this.allData
                        .data.summary.total_data_matching) * 100).toFixed(2)
            },
            async openHasilMatchingTerpilih(idspool) {
                // console.log(idspool)
                this.selectedSpool = null
                this.modalHasilMatching = true
                this.blockedPanel = true
                this.dataDetailMatchingResult = null
                this.detailMatchingNama = ''
                this.detailMatchingAlamat = ''
                try {
                    const result = await DataService.getDetailMatchingResultsUser(this.selectedKegiatan.id_kegiatan, this.currentUser.id, idspool);
                    if(result.data.meta.status == 'error') {
                        this.modalHasilMatching = false
                        this.toastMessage('error', 'Error!', 'Data kegiatan tidak ditemukan!');    
                        return
                    }

                    // console.log(result.data.data)
                    this.dataDetailMatchingResult = result.data.data
                    this.selectedSpool = this.dataDetailMatchingResult[0].id_spool
                    this.detailMatchingNama = result.data.data[0].matching_nama
                    this.detailMatchingAlamat = result.data.data[0].matching_alamat
                    this.blockedPanel = false
                } catch(error) {
                    console.log(error)
                    this.modalHasilMatching = true
                    this.toastMessage('error', 'Error!', 'Something went wrong!');
                }
            },
            async showMatchingResult () {
                this.displayDialogResultMatching = true
                this.loadingDialog = true
                try {
                    const result = await DataService.getMatchingResultsUser(this.selectedKegiatan.id_kegiatan, this.currentUser.id);                        
                    if(result.data.meta.status == 'error') {
                        this.loadingDialog = false
                        this.toastMessage('error', 'Error!', 'Data kegiatan tidak ditemukan!');    
                        return
                    }
                    // console.log(result.data.data)
                    this.dataMatchingResult = result.data.data
                    this.loadingDialog = false
                } catch (error) {
                    console.log(error)
                    this.loadingDialog = false
                    this.toastMessage('error', 'Error!', 'Something went wrong!');
                }

            },            
            udpateSelectedMatch(idsbr) {
                const isExist = this.selectedData.findIndex(data => data == idsbr)
                
                // kalo ada, hapus dari array
                if(isExist > -1) {
                    this.selectedData.splice(isExist, 1)
                    return
                }

                this.selectedData.push(idsbr)
            },
            async getListKegiatan() {
                try {
                    // const listKegiatan = await DataService.getKegiatanActiveMatching()
                    const listKegiatan = await DataService.getDaftarKegiatanMatchingUser(this.currentUser.id, 'active')
                    this.kegiatanOptions = listKegiatan.data                   
                } catch(error) {
                    this.onLoadData = false
                    this.isIframeShow = true
                    this.isFreshLoad = false
                    this.toastMessage('error', 'Error!', error.message);
                }
            },
            loadIframe() {
                if(this.allData == null) {
                    this.isIframeShow = true
                    this.isFreshLoad = false
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
            async getDataMatchingUser(id_kegiatan, id_user) {
                try {

                    this.onLoadData = true
                    this.setDefaultCon();

                    const response = await DataService.getDataMatching(id_kegiatan, id_user)
                    
                    if(response.data.meta.status == 'error') {
                        this.onLoadData = false
                        this.errorMessages.push(response.data.meta.message)
                        this.toastMessage('error', 'Error!', 'Something went wrong!');
                        return
                    }
                    
                    if (this.isMatchingDone(response)) return

                    this.allData = response.data
                    this.sbrData = this.allData.data.spool
                    this.matchingData = this.allData.data.matching
                    this.progresMatching = ((this.allData.data.summary.sudah_matching / this.allData
                        .data.summary.total_data_matching) * 100).toFixed(2)
                    this.setLockedData();                    
                    
                    this.onLoadData = false                 
                    
                    setTimeout(() => {    
                        document.getElementById('filter-perusahaan').value = ''
                        document.getElementById('filter-perusahaan').dispatchEvent(new Event('input'))                    
                        document.getElementById('filter-perusahaan').focus()
                    }, 500)

                } catch(error)  {
                    this.onLoadData = false
                    this.isIframeShow = true
                    this.isFreshLoad = false
                    this.toastMessage('error', 'Error!', error.message);
                }
            },
            skip() {               
                this.getDataMatchingUser(this.selectedKegiatan.id_kegiatan, this.currentUser.id)
            },
            ignore() {
                this.$confirm.require({
                    message: 'Data akan ditandai tidak layak untuk dimasukan ke database ?',
                    header: 'Konfirmasi',
                    icon: 'pi pi-exclamation-triangle',
                    accept: () => {
                        this.loadingDialog = true
                        this.proceedIgnoreData()
                    },
                    reject: () => {
                        // this.$toast.add({severity:'error', summary:'Rejected', detail:'You have rejected', life: 3000});
                    }
                });
            },
            async proceedIgnoreData() {
                try {
                    const data = {
                        "id_alokasi" : this.sbrData.id_alokasi,
                        "id_spool": this.sbrData.id_spool
                    }
                    const result = await DataService.postIgnoreData(this.selectedKegiatan.id_kegiatan, this.currentUser.id, data)

                    this.toastMessage('success', 'Sukses!', result.data.meta.message);
                    this.loadingDialog = false
                    this.getDataMatchingUser(this.selectedKegiatan.id_kegiatan, this.currentUser.id)

                } catch (error) {
                    console.log(error)
                    this.toastMessage('error', 'Error!', 'Something went wrong!');
                    this.loadingDialog = false
                }
            },
            async submit() {
                try {
                    this.loadingDialog = true
                    const postForm = {
                        "id_alokasi": this.sbrData.id_alokasi,
                        "id_spool": this.sbrData.id_spool,
                        "idsbr": [...this.selectedData]
                    }
                    const result = await DataService.postDataMatching(this.selectedKegiatan.id_kegiatan, this.currentUser.id, postForm)
                    
                    if(result.data.meta.status == 'error') throw new Error(result.data.meta.message)

                    this.toastMessage('success', 'Sukses!', result.data.meta.message);
                    this.loadingDialog = false
                    this.getDataMatchingUser(this.selectedKegiatan.id_kegiatan, this.currentUser.id)

                } catch (error) {
                    this.toastMessage('error', 'Error!', error.message);
                    this.loadingDialog = false
                }

            },
            isMatchingDone(response) {
                let status = false
                if (response.data.data.summary.sudah_matching == response.data.data.summary
                    .total_data_matching) {
                    this.errorMessages = []
                    this.successMessage = "Selamat. Kamu sudah selesai Matching"
                    this.loadingDialog = false
                    this.onLoadData = false
                    this.allData = null
                    this.sbrData = null
                    this.matchingData = null
                    status = true
                }
                return status
            },
            getKegiatanData(data) {
                if(data == null) {
                    this.setDefaultCon()
                    this.isIframeShow = true
                    this.isFreshLoad = false
                    return
                }
                this.getDataMatchingUser(data.id_kegiatan, this.currentUser.id)
            },
            setDefaultCon() {
                this.errorMessages = []
                this.successMessage = null
                this.loadingDialog = false
                this.isIframeShow = false
                this.isFreshLoad = false
                this.allData = null
                this.sbrData = null
                this.matchingData = null
                this.dataMatchingResult = null
            },
            setLockedData() {
                this.selectedData = []
                this.lockedData[0]['nama_perusahaan'] = this.sbrData['nama_perusahaan']
                this.lockedData[0]['alamat'] = this.sbrData['alamat']
                this.lockedData[0]['nama_provinsi'] = this.sbrData['nama_provinsi']
                this.lockedData[0]['kode_provinsi'] = this.sbrData['kode_provinsi']
                this.lockedData[0]['nama_kabupaten_kota'] = this.sbrData['nama_kabupaten_kota']
                this.lockedData[0]['kode_kabupaten_kota'] = this.sbrData[
                    'kode_kabupaten_kota']
                this.lockedData[0]['nama_kecamatan'] = this.sbrData['nama_kecamatan']
                this.lockedData[0]['kode_kecamatan'] = this.sbrData['kode_kecamatan']
                this.lockedData[0]['nama_kelurahan_desa'] = this.sbrData['nama_kelurahan_desa']
                this.lockedData[0]['kode_kelurahan_desa'] = this.sbrData[
                    'kode_kelurahan_desa']
                this.lockedData[0]['nomor_telepon'] = this.sbrData['nomor_telepon']
                this.lockedData[0]['aktivitas_perusahaan'] = this.sbrData[
                    'aktivitas_perusahaan']
                this.lockedData[0]['kbli_aktivitas'] = this.sbrData['kbli_aktivitas']
            },            
            isDataEqual(sbr, spool) {
                return sbr == spool && spool != null
            },            
        }

    }

    document.onkeydown = function (e) {       
        if(e.keyCode == 191 && e.ctrlKey) {
            document.getElementById('filter-perusahaan').focus()
        }
    };
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

    button.onclick-btn-custom {
        box-shadow: none !important;
    }  

    .submit-btn-matcha:hover {
        box-shadow: 0 8px 25px -8px #7367f0 !important;
    }

    ::v-deep(.p-button .p-badge) {
        font-size: 1.2rem !important;
        min-width: 1.2rem !important;
        height: 1.2rem !important;
        line-height: 1.2rem !important;
    }

    .bgMatched {
        color: white;
        font-weight: 700;
        background-color: #56ca0099;;       
    }

    ::v-deep(td) {
        padding: 0 !important;
    }

    td > div {
        padding: 15px !important;
        width: 100%;
        height: 100%;
        text-align: center;
        cursor: pointer;
    }    

    ::v-deep(thead th) {
        background-color: #f3f2f7 !important;
        vertical-align: top;
        text-transform: uppercase;
        font-size: .857rem;
        letter-spacing: .5px;
        text-align: center !important;
    }

    ::v-deep(div.p-column-header-content) {
        width: 100%;
    }

    ::v-deep(span.p-column-title) {
        margin: 0 auto;
    }

    .frozenRowBg {
        color: #9155fd;
        font-weight: 700;
        background-color: #dee2e6;
    }    
</style>