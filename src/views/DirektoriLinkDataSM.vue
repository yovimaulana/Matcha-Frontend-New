<template>
    <div class="about">
        <Toast />
        <br><br>
        <div class="cst-logo-hero">
            <img src="../assets/bps.svg" class="hvr-bob mybob p-mt-1">
        </div>
        <div class="p-col-12 p-lg-12 p-grid p-d-flex p-jc-center p-ai-center padded">
            <Card class="p-col-8 p-m-2 animate__animated animate__fadeIn">
                <template #title>
                    <div class="cst-title-katalog">
                        Form Katalog Data SBR
                    </div>

                </template>
                <template #content>
                    <div>
                        <div class="p-fluid">
                            <div class="p-field p-mb-4">
                                <span class="p-float-label">
                                    <Dropdown  :filter="true" v-model="formModel.subjectMatter" :options="direktoratOptions"
                                        optionLabel="name" optionValue="code" placeholder="Pilih Direktorat"
                                        :class="classFormModel.subjectMatter" />

                                </span>
                            </div>
                            <div class="p-field p-mb-4">
                                <span class="p-float-label">
                                    <InputText v-model="formModel.namaKegiatan" placeholder="Nama Kegiatan"
                                        id="nama_kegiatan" type="text" :class="classFormModel.namaKegiatan" />
                                    <label for="nama_kegiatan">Nama Kegiatan</label>
                                </span>
                            </div>
                            <Fieldset legend="Contact Person">
                                <div class="p-field p-mb-4">
                                    <span class="p-float-label">
                                        <InputText v-model="formModel.contactPerson" placeholder="Nama (Contact Person)"
                                            id="contact_person" type="text" :class="classFormModel.contactPerson" />
                                        <label for="contact_person">Nama (Contact Person)</label>
                                    </span>
                                    <!-- <span style="float:left; color: grey; font-size: small; text-align: left">Contoh Isian: Nama - No HP ->
                                        Rudi - 0857111111111</span> -->
                                </div>

                                <div class="p-field p-mb-4">
                                    <span class="p-float-label">
                                        <InputText v-model="formModel.nohp_contactPerson" placeholder="No HP (Contact Person)"
                                            id="nohp_contact_person" type="text" :class="classFormModel.nohp_contactPerson" />
                                        <label for="nohp_contact_person">No HP (Contact Person)</label>
                                    </span>
                                    <!-- <span style="float:left; color: grey; font-size: small; text-align: left">Contoh Isian: Nama - No HP ->
                                        Rudi - 0857111111111</span> -->
                                </div>
                                <div class="p-field p-mb-4">
                                    <span class="p-float-label">
                                        <InputText v-model="formModel.email_contactPerson" placeholder="Email (Contact Person)"
                                            id="email_contact_person" type="text" :class="classFormModel.email_contactPerson" />
                                        <label for="emai_contact_person">Email (Contact Person)</label>
                                    </span>
                                    <!-- <span style="float:left; color: grey; font-size: small; text-align: left">Contoh Isian: 0857111111111</span> -->
                                </div>

                                <div class="p-field">
                                    <span class="p-float-label">
                                        <InputText v-model="formModel.emailSM_contactPerson" placeholder="Email Subject Matter / Fungsi"
                                            id="emailsm_contact_person" type="text" :class="classFormModel.emailSM_contactPerson" />
                                        <label for="emailsm_contact_person">Email Subject Matter / Fungsi</label>
                                    </span>
                                    <!-- <span style="float:left; color: grey; font-size: small; text-align: left">Contoh Isian: Nama - No HP ->
                                        Rudi - 0857111111111</span> -->
                                </div>
                            </Fieldset>                                                                                                    

                            <div class="p-field p-mb-4 cst-container-sel-year">
                                <span class="p-float-label">
                                    <MultiSelect v-model="selectedTahun" :options="tahunKegiatanOptions"
                                        optionLabel="name" placeholder="Tahun Kegiatan"
                                        :class="classFormModel.selectedTahun" />
                                </span>
                            </div>


                            <div class="p-grid" v-if="this.selectedTahun !== []">
                                <!-- 2022 -->
                                <div class="p-col-12 p-lg-4 cst-katalog-year" v-if="tahun2022Display ">
                                    <h1>2022</h1>
                                    <div class="p-field p-mb-4">
                                        <span class="p-float-label">
                                            <InputText v-model="formModel.linkData2022" placeholder="Link Data 2022"
                                                id="linkdata2022" type="text" :class="classFormModel.linkData2022" />
                                            <label for="linkdata2022">Link Data 2022</label>
                                        </span>
                                    </div>
                                    <div class="p-field p-mb-4">

                                        <span class="p-float-label">
                                            <InputText v-model="formModel.linkMetadata2022"
                                                placeholder="Link Metadata 2022" id="nama_kegiatan" type="text"
                                                :class="classFormModel.linkMetadata2022" />
                                            <label for="linkmetadata2022">Link Metadata 2022</label>
                                        </span>
                                    </div>
                                    <div class="p-field p-mb-4">

                                        <span class="p-float-label">
                                            <InputText v-model="formModel.linkBukuPedoman2022"
                                                placeholder="Link Buku Pedoman 2022" id="linkBukuPedoman2022"
                                                type="text" :class="classFormModel.linkBukuPedoman2022" />
                                            <label for="linkBukuPedoman2022">Link Buku Pedoman 2022</label>
                                        </span>
                                    </div>
                                    <div class="p-field p-mb-4">

                                        <span class="p-float-label">
                                            <InputText v-model="formModel.linkKuesioner2022"
                                                placeholder="Link Kuisioner 2022" id="linkKuesioner2022" type="text"
                                                :class="classFormModel.linkKuesioner2022" />
                                            <label for="linkKuesioner2022">Link Kuisioner 2022</label>
                                        </span>
                                    </div>
                                </div>
                                <!-- 2021 -->
                                <div class="p-col-12 p-lg-4 cst-katalog-year" v-if="tahun2021Display ">
                                    <h1>2021</h1>
                                    <div class="p-field p-mb-4">
                                        <span class="p-float-label">
                                            <InputText v-model="formModel.linkData2021" placeholder="Link Data 2021"
                                                id="linkdata2021" type="text" :class="classFormModel.linkData2021" />
                                            <label for="linkdata2021">Link Data 2021</label>
                                        </span>
                                    </div>
                                    <div class="p-field p-mb-4">

                                        <span class="p-float-label">
                                            <InputText v-model="formModel.linkMetadata2021"
                                                placeholder="Link Metadata 2021" id="nama_kegiatan" type="text"
                                                :class="classFormModel.linkMetadata2021" />
                                            <label for="linkmetadata2021">Link Metadata 2021</label>
                                        </span>
                                    </div>
                                    <div class="p-field p-mb-4">

                                        <span class="p-float-label">
                                            <InputText v-model="formModel.linkBukuPedoman2021"
                                                placeholder="Link Buku Pedoman 2021" id="linkBukuPedoman2021"
                                                type="text" :class="classFormModel.linkBukuPedoman2021" />
                                            <label for="linkBukuPedoman2021">Link Buku Pedoman 2021</label>
                                        </span>
                                    </div>
                                    <div class="p-field p-mb-4">

                                        <span class="p-float-label">
                                            <InputText v-model="formModel.linkKuesioner2021"
                                                placeholder="Link Kuisioner 2021" id="linkKuesioner2021" type="text"
                                                :class="classFormModel.linkKuesioner2021" />
                                            <label for="linkKuesioner2021">Link Kuisioner 2021</label>
                                        </span>
                                    </div>
                                </div>
                                <!-- 2020 -->                                
                                <div class="p-col-12 p-lg-4 cst-katalog-year" v-if="tahun2020Display">
                                    <h1>2020</h1>
                                    <div class="p-field p-mb-4">
                                        <span class="p-float-label">
                                            <InputText v-model="formModel.linkData2020" placeholder="Link Data 2020"
                                                id="linkdata2020" type="text" :class="classFormModel.linkData2020" />
                                            <label for="linkdata2020">Link Data 2020</label>
                                        </span>
                                    </div>
                                    <div class="p-field p-mb-4">

                                        <span class="p-float-label">
                                            <InputText v-model="formModel.linkMetadata2020"
                                                placeholder="Link Metadata 2020" id="nama_kegiatan" type="text"
                                                :class="classFormModel.linkMetadata2020" />
                                            <label for="linkmetadata2020">Link Metadata 2020</label>
                                        </span>
                                    </div>
                                    <div class="p-field p-mb-4">

                                        <span class="p-float-label">
                                            <InputText v-model="formModel.linkBukuPedoman2020"
                                                placeholder="Link Buku Pedoman 2020" id="linkBukuPedoman2020"
                                                type="text" :class="classFormModel.linkBukuPedoman2020" />
                                            <label for="linkBukuPedoman2020">Link Buku Pedoman 2020</label>
                                        </span>
                                    </div>
                                    <div class="p-field p-mb-4">

                                        <span class="p-float-label">
                                            <InputText v-model="formModel.linkKuesioner2020"
                                                placeholder="Link Kuisioner 2020" id="linkKuesioner2020" type="text"
                                                :class="classFormModel.linkKuesioner2020" />
                                            <label for="linkKuesioner2020">Link Kuisioner 2020</label>
                                        </span>
                                    </div>
                                </div>
                                
                                
                            </div>
                            <!-- <Button label="Tambah Kegiatan" class="p-button-info " @click="submit()" icon="" />  -->
                            <Button label="Submit" class="p-button-success " @click="submit()" icon="" />

                        </div>
                        
                        <hr class="dashed-2">
                        <div class="cst-footer">
                            <p>COPYRIGHT © 2022 <span id="cst-footer-b">B</span><span id="cst-footer-p">P</span><span id="cst-footer-s">S</span>, All rights Reserved 
                            <br/>Thank you
                                so <span id="cst-footer-matcha-txt">MatchA</span> for what you do</p>
                            <p><span id="cst-footer-heart">&lt; /&gt; &nbsp;</span> dengan <i
                                    class="p-ml-2 pi pi-heart-fill animate__animated animate__flash animate__slow animate__infinite	infinite hvr-pulse-grow "></i></p>
                        </div>

                    </div>
                </template>

            </Card>


        </div>


        <Loading v-model:active="loadingDialog" :is-full-page="true" :color="'#86d166'" :background-color="'black'"
            :opacity="0.75">
            <slot>
                <MyLoading></MyLoading>
            </slot>
        </Loading> 

        <ConfirmDialog></ConfirmDialog>

    </div>
</template>
<script>
    import InputText from 'primevue/inputtext';
    import Toast from 'primevue/toast';
    import MyLoading from '../components/MyLoading2.vue'
    import MultiSelect from 'primevue/multiselect';
    import ConfirmDialog from 'primevue/confirmdialog';
    import Fieldset from 'primevue/fieldset';

    import Loading from 'vue-loading-overlay';
    import 'vue-loading-overlay/dist/vue-loading.css';
    import axios from 'axios'
    // import Dropdown from 'primevue/dropdown';
    export default {
        components: {
            InputText,
            Toast,
            MultiSelect,
            MyLoading,
            Loading,
            ConfirmDialog,
            Fieldset
            // Dropdown
        },
        data() {
            return {
                selectedTahun: [],
                direktoratOptions: [{
                        name: 'Pengembangan Metodologi Sensus dan Survei',
                        code: 'Pengembangan Metodologi Sensus dan Survei'
                    },
                    {
                        name: 'Diseminasi Statistik',
                        code: 'Diseminasi Statistik'
                    },
                    {
                        name: 'Sistem Informasi Statistik',
                        code: 'Sistem Informasi Statistik'
                    },
                    {
                        name: 'Statistik Kependudukan dan Ketenagakerjaan',
                        code: 'Statistik Kependudukan dan Ketenagakerjaan'
                    },
                    {
                        name: 'Statistik Kesejahteraan Rakyat',
                        code: 'Statistik Kesejahteraan Rakyat'
                    },
                    {
                        name: 'Statistik Ketahanan Sosial',
                        code: 'Statistik Ketahanan Sosial'
                    },
                    {
                        name: 'Statistik Tanaman Pangan, Hortikultura, dan Perkebunan',
                        code: 'Statistik Tanaman Pangan, Hortikultura, dan Perkebunan'
                    },
                    {
                        name: 'Statistik Peternakan, Perikanan, dan Kehutanan',
                        code: 'Statistik Peternakan, Perikanan, dan Kehutanan'
                    },
                    {
                        name: 'Statistik Industri',
                        code: 'Statistik Industri'
                    },
                    {
                        name: 'Statistik Distribusi',
                        code: 'Statistik Distribusi'
                    },
                    {
                        name: 'Statistik Harga',
                        code: 'Statistik Harga'
                    },
                    {
                        name: 'Statistik Keuangan, Teknologi Informasi, dan Pariwisata',
                        code: 'Statistik Keuangan, Teknologi Informasi, dan Pariwisata'
                    },
                    {
                        name: 'Neraca Produksi',
                        code: 'Neraca Produksi'
                    },
                    {
                        name: 'Neraca Pengeluaran',
                        code: 'Neraca Pengeluaran'
                    },
                    // {
                    //     name: 'Analisis dan Pengembangan Statistik',
                    //     code: 'Analisis dan Pengembangan Statistik'
                    // },


                ],
                tahunKegiatanOptions: [
                    {
                        name: '2022',
                        code: '2022'
                    },
                    {
                        name: '2021',
                        code: '2021'
                    },
                    {
                        name: '2020',
                        code: '2020'
                    },                                        
                ],
                tahun2020Display: false,
                tahun2021Display: false,
                tahun2022Display: false,
                formModel: {
                    subjectMatter: null,
                    namaKegiatan: null,
                    contactPerson: null,
                    nohp_contactPerson: null,
                    email_contactPerson: null,
                    emailSM_contactPerson: null,
                    linkData2020: null,
                    linkMetadata2020: null,
                    linkBukuPedoman2020: null,
                    linkKuesioner2020: null,
                    linkData2021: null,
                    linkMetadata2021: null,
                    linkBukuPedoman2021: null,
                    linkKuesioner2021: null,
                    linkData2022: null,
                    linkMetadata2022: null,
                    linkBukuPedoman2022: null,
                    linkKuesioner2022: null
                },
                classFormModel: {
                    subjectMatter: null,
                    namaKegiatan: null,
                    contactPerson: null,
                    nohp_contactPerson: null,
                    email_contactPerson: null,
                    emailSM_contactPerson: null,
                    selectedTahun: null,
                    linkData2020: null,
                    linkMetadata2020: null,
                    linkBukuPedoman2020: null,
                    linkKuesioner2020: null,
                    linkData2021: null,
                    linkMetadata2021: null,
                    linkBukuPedoman2021: null,
                    linkKuesioner2021: null,
                    linkData2022: null,
                    linkMetadata2022: null,
                    linkBukuPedoman2022: null,
                    linkKuesioner2022: null
                },
                loadingDialog: false,
                finalForm: null
            }
        },
        watch: {
            selectedTahun(newValue) {
                // console.log('new', newValue)
                // console.log('old', oldValue)
                this.tahun2020Display = false
                this.tahun2021Display = false
                this.tahun2022Display = false
                if (newValue === []) {
                    this.tahun2020Display = false
                    this.tahun2021Display = false
                    this.tahun2022Display = false
                }

                newValue.forEach(element => {
                    if (element.code === '2020') this.tahun2020Display = true
                    if (element.code === '2021') this.tahun2021Display = true
                    if (element.code === '2022') this.tahun2022Display = true
                });
            }
        },
        methods: {
            async submit() {
                
                if (this.validate()) {
                    let tempForm = []                   

                    if (this.tahun2020Display) {
                        tempForm.push({
                            "tahun_kegiatan": 2020,
                            "subject_matter": this.formModel.subjectMatter,
                            "nama_kegiatan": this.formModel.namaKegiatan,
                            "contact_person": this.formModel.contactPerson,                            
                            "nohp_contact_person": this.formModel.nohp_contactPerson,
                            "email_contact_person": this.formModel.email_contactPerson,
                            "emailSM_contact_person": this.formModel.emailSM_contactPerson,
                            "link_data": this.formModel.linkData2020,
                            "link_metadata": this.formModel.linkMetadata2020,
                            "link_bukped": this.formModel.linkBukuPedoman2020,
                            "link_kuesioner": this.formModel.linkKuesioner2020
                        })
                    }
                    

                    if (this.tahun2021Display) {
                        tempForm.push({
                            "tahun_kegiatan": 2021,
                            "subject_matter": this.formModel.subjectMatter,
                            "nama_kegiatan": this.formModel.namaKegiatan,
                            "contact_person": this.formModel.contactPerson,
                            "nohp_contact_person": this.formModel.nohp_contactPerson,
                            "email_contact_person": this.formModel.email_contactPerson,
                            "emailSM_contact_person": this.formModel.emailSM_contactPerson,
                            "link_data": this.formModel.linkData2021,
                            "link_metadata": this.formModel.linkMetadata2021,
                            "link_bukped": this.formModel.linkBukuPedoman2021,
                            "link_kuesioner": this.formModel.linkKuesioner2021
                        })                        
                    }

                    if(this.tahun2022Display) {
                        
                        tempForm.push({
                            "tahun_kegiatan": 2022,
                            "subject_matter": this.formModel.subjectMatter,
                            "nama_kegiatan": this.formModel.namaKegiatan,
                            "contact_person": this.formModel.contactPerson,
                            "nohp_contact_person": this.formModel.nohp_contactPerson,
                            "email_contact_person": this.formModel.email_contactPerson,
                            "emailSM_contact_person": this.formModel.emailSM_contactPerson,
                            "link_data": this.formModel.linkData2022,
                            "link_metadata": this.formModel.linkMetadata2022,
                            "link_bukped": this.formModel.linkBukuPedoman2022,
                            "link_kuesioner": this.formModel.linkKuesioner2022
                        })
                    }

                    this.finalForm = tempForm

                    console.log(this.finalForm)

                    this.$confirm.require({
                        message: 'Are you sure you want to proceed?',
                        header: 'Confirmation',
                        icon: 'pi pi-exclamation-triangle',
                        accept: async () => {
                            this.loadingDialog = true
                            try {
                                await axios.post("https://matcha-dev.bps.go.id/matcha-backend/api/direktori-link-sm",
                                        this.finalForm)
                                    .then(response => {
                                        // console.log('response', response)
                                        // console.log('final Form', this.finalForm)
                                        this.formModel = {
                                            subjectMatter: null,
                                            namaKegiatan: null,
                                            contactPerson: null,
                                            nohp_contact_person: null,
                                            email_contact_person: null,
                                            emailSM_contact_person: null,
                                            linkData2020: null,
                                            linkMetadata2020: null,
                                            linkBukuPedoman2020: null,
                                            linkKuesioner2020: null,
                                            linkData2021: null,
                                            linkMetadata2021: null,
                                            linkBukuPedoman2021: null,
                                            linkKuesioner2021: null,
                                            linkData2022: null,
                                            linkMetadata2022: null,
                                            linkBukuPedoman2022: null,
                                            linkKuesioner2022: null
                                        }

                                        this.classFormModel = {
                                            subjectMatter: null,
                                            namaKegiatan: null,
                                            contactPerson: null,
                                            nohp_contact_person: null,
                                            email_contact_person: null,
                                            emailSM_contact_person: null,
                                            selectedTahun: null,
                                            linkData2020: null,
                                            linkMetadata2020: null,
                                            linkBukuPedoman2020: null,
                                            linkKuesioner2020: null,
                                            linkData2022: null,
                                            linkMetadata2022: null,
                                            linkBukuPedoman2022: null,
                                            linkKuesioner2022: null
                                        }
                                        this.loadingDialog = false
                                        this.$toast.add({
                                            severity: 'success',
                                            summary: 'Berhasil !',
                                            detail: 'Data berhasil ditambahkan',
                                            life: 3000
                                        });
                                    }).catch(error => {
                                        // console.log(error)
                                        this.loadingDialog = false
                                        this.$toast.add({
                                            severity: 'error',
                                            summary: 'Gagal !',
                                            detail: 'Terdapat kesalahan pada jaringan anda',
                                            life: 3000
                                        })
                                    })
                            } catch (error) {
                                // console.log('error service', error)
                                this.loadingDialog = false
                                this.$toast.add({
                                    severity: 'error',
                                    summary: 'Gagal !',
                                    detail: 'Ups ada error',
                                    life: 3000
                                })
                            }
                        },
                        reject: () => {
                            // this.$toast.add({severity:'error', summary:'Rejected', detail:'You have rejected', life: 3000});
                        }
                    });                                
                } else {
                    this.loadingDialog = false
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Ups !',
                        detail: 'Ada field yang belum terisi',
                        life: 3000
                    });
                }
                
            },
            validate() {
                if (this.formModel.subjectMatter !== null &&
                    this.formModel.namaKegiatan !== null &&
                    this.formModel.contactPerson !== null && 
                    this.formModel.nohp_contactPerson !== null && 
                    this.formModel.email_contactPerson !== null && 
                    this.selectedTahun.length !== 0
                ) {
                   
                    if (this.selectedTahun.length > 0) {

                        if(this.tahun2020Display) {
                            if(this.formModel.linkMetadata2020 == null ||
                                this.formModel.linkBukuPedoman2020 == null ||
                                this.formModel.linkKuesioner2020 == null || this.formModel.linkData2020 == null) {
                                    Object.keys(this.classFormModel).forEach(element => {
                                        this.formModel[element] == null || this.formModel[element].trim() == '' ? this.classFormModel[element] =
                                            'p-invalid' :
                                            this
                                            .classFormModel[element] = ''
                                    });
                                    return false
                                }
                        }

                        if(this.tahun2021Display) {
                            if(this.formModel.linkMetadata2021 == null ||
                                this.formModel.linkBukuPedoman2021 == null ||
                                this.formModel.linkKuesioner2021 == null || this.formModel.linkData2021 == null) {
                                    Object.keys(this.classFormModel).forEach(element => {
                                        this.formModel[element] == null || this.formModel[element].trim() == '' ? this.classFormModel[element] =
                                            'p-invalid' :
                                            this
                                            .classFormModel[element] = ''
                                    });
                                    return false
                                }
                        }

                        if(this.tahun2022Display) {
                            if(this.formModel.linkMetadata2022 == null ||
                                this.formModel.linkBukuPedoman2022 == null ||
                                this.formModel.linkKuesioner2022 == null || this.formModel.linkData2022 == null) {
                                    Object.keys(this.classFormModel).forEach(element => {
                                        this.formModel[element] == null || this.formModel[element].trim() == '' ? this.classFormModel[element] =
                                            'p-invalid' :
                                            this
                                            .classFormModel[element] = ''
                                    });
                                    return false
                                }
                        }

                        return true                        

                    } 

                    // Object.keys(this.classFormModel).forEach(element => {
                    //     this.formModel[element] == null || this.formModel[element].trim() == '' ? this.classFormModel[element] = 'p-invalid' : this
                    //         .classFormModel[element] = ''
                    // });
                    // return false

                } 


                Object.keys(this.classFormModel).forEach(element => {
                    if (element != 'selectedTahun' && element != 'emailSM_contactPerson') {
                        this.formModel[element] == null || this.formModel[element].trim() == '' ? this.classFormModel[element] = 'p-invalid' : this
                            .classFormModel[element] = ''
                    }
                    this.selectedTahun.length == 0 ? this.classFormModel['selectedTahun'] = 'p-invalid' : this
                        .classFormModel['selectedTahun'] = ''
                });
                return false

            }
        }
    }
</script>

<style>
        
    body {
        /* background-color: #f5f5f5 !important; */
        background-color: #f5f4f9 !important;
    }
</style>

<style scoped>

    @media only screen and (max-width: 700px) {
        .padded .p-card {
            flex: 100%;
        }
    }

    div.padded {
        margin-left: 0;
    }
    .dashed-2 {
        margin-top: 35px;
        border: none;
        height: 0.7px;
        background: grey;
        background: repeating-linear-gradient(90deg, grey, grey 6px, transparent 6px, transparent 12px);
    }
    .p-card {
        border-radius: 0.375rem !important;
        max-width: 800px !important;
        box-shadow: 0.5rem 0.5rem 2rem 0 rgb(8 15 41 / 8%),
            0 0 1px 0 rgb(8 15 41 / 8%);
    }
    .vertical-container {
        margin: 0;
        height: 200px;
        background: var(--surface-d);
        border-radius: 4px;
    }

    img {
        --animate-duration: 5s;
    }

    /* Bob */
    @-webkit-keyframes hvr-bob {
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
    }

    .hvr-bob,
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
    }

    .cst-logo-hero {
        text-align: center;
    }

    div.cst-logo-hero img {
        width: 100px;
    }   
    
    .cst-title-katalog {
        text-align: center;
    }

    div.cst-katalog-year h1 {
        text-align: center;
    }

    div.cst-footer {
        margin-top: 30px; text-align: center;
    }

    #cst-footer-b {
        color: #00aeef;font-weight: 700;
    }

    #cst-footer-p {
        color: #8cc63f;font-weight: 700;
    }

    #cst-footer-s {
        color: #f7941e;font-weight: 700;
    }

    #cst-footer-matcha-txt {
        color: #78b34d; font-weight: 700;
    }

    #cst-footer-heart {
        font-weight: 700;
    }

    i.pi-heart-fill {
        color: #D32F2F !important;
    }

    .cst-container-sel-year {
        margin-top: 35px
    }
</style>