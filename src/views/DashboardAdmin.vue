<template>
    <div>
        <Toast />
        <div class="p-col-12 p-lg-12">
            <Breadcrumb class="custom-breadcrumb" :home="home" :model="items" />
        </div>
        <div class="p-grid">
            <div class="field p-col-12 p-lg-2 p-md-3">
                <h4 style="margin-top: 0;margin-bottom: 10px;padding-left: 15px; color: #5e5873;"><i style="font-size: 0.8rem" class="pi pi-filter"></i> Filters:</h4>
                <Card class="custom-card-matcha ccm-custom" style="padding: 15px">            
                    <template #content>                        
                        <div class="p-grid">
                            <div class="field p-col-12">
                                <h4 style="margin-top:5px; color: #5e5873">Matching</h4>
                                <div class="field-checkbox" style="margin-bottom: 10px">                            
                                    <RadioButton id="matching1" name="filter-kegiatan" value="matching-x" v-model="filterStatus" style="margin-right: 10px;" />
                                    <label for="matching1" style="color: #5e5873; cursor: pointer">Inactive</label>
                                </div>
                                <div class="field-checkbox" style="margin-bottom: 10px">
                                    <RadioButton id="matching2" name="filter-kegiatan" value="matching-1" v-model="filterStatus" style="margin-right: 10px;" />
                                    <label for="matching2" style="color: #5e5873; cursor: pointer">Active</label>
                                </div>
                                <div class="field-checkbox">
                                    <RadioButton id="matching3" name="filter-kegiatan" value="matching-0" v-model="filterStatus" style="margin-right: 10px;" />
                                    <label for="matching3" style="color: #5e5873; cursor: pointer">Done</label>
                                </div>
                            </div>   
                            <div class="field p-col-12">
                                <h4 style="color: #5e5873">Assessment</h4>
                                <div class="field-checkbox" style="margin-bottom: 10px">                            
                                    <RadioButton id="assessment1" name="filter-kegiatan" value="assessment-x" v-model="filterStatus" style="margin-right: 10px;" />
                                    <label for="assessment1" style="color: #5e5873; cursor: pointer">Inactive</label>
                                </div>
                                <div class="field-checkbox" style="margin-bottom: 10px">
                                    <RadioButton id="assessment2" name="filter-kegiatan" value="assessment-1" v-model="filterStatus" style="margin-right: 10px;" />
                                    <label for="assessment2" style="color: #5e5873; cursor: pointer">Active</label>
                                </div>
                                <div class="field-checkbox">
                                    <RadioButton id="assessment3" name="filter-kegiatan" value="assessment-0" v-model="filterStatus" style="margin-right: 10px;" />
                                    <label for="assessment3" style="color: #5e5873; cursor: pointer">Done</label>
                                </div>
                            </div>                                                          
                        </div>
                    </template>
                    <template #footer>
                        <Button @click="clearFilterKegiatan()" icon="pi pi-filter-slash" label="Clear Filter" class="p-button-sm p-button-secondary" style="width:100%" />
                    </template>            
                </Card>
            </div>
            <div class="field p-col-12 p-lg-10 p-md-9">
                <Skeleton v-if="kegiatanOptions == null" width="calc(100% - 30px)" height="3.3rem"
                    style="margin-top: 10px; margin-left: 17px; border-radius: 0.357rem; background-color: #8080802b;" />
                <Card v-if="kegiatanOptions != null" class="custom-card-matcha ccm-custom">
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
                <div v-if="dataLoading" class="p-grid" style="margin-top: 10px;">
                    <div class="p-col-12 p-lg-6 p-md-6 p-sm-6">
                        <Skeleton width="95%" height="10rem" style="margin-top: 10px; margin-left: 17px; border-radius: 0.357rem; background-color: #8080802b;" />
                    </div>
                    <div class="p-col-12 p-lg-6 p-md-6 p-sm-6">
                        <Skeleton width="95%" height="10rem" style="margin-top: 10px; padding-right: 17px; border-radius: 0.357rem; background-color: #8080802b; float: right;" />
                    </div>
                </div>

                <div class="p-grid">
                    <!-- Matching Status -->
                    <div class="p-col-12 p-lg-6 p-md-6 p-sm-6" v-if="this.kegiatanData !== null" style="padding-right: 22px;">
                        <Card class="custom-card-matcha animate__animated animate__fadeIn"  style="border-radius: 0.357rem; margin-top: 15px; padding: 15px">
                            <template #title>
                                <div style="text-align: center; text-transform: uppercase;">Matching</div>
                            </template>
                            <template #content>
                                <div class="p-grid p-jc-center" style=" border-left-color: red; ">
                                    <div class="p-col-5">
                                        <div style="text-align: center">
                                            <span style="font-size: 40px;"> {{this.kegiatanData.data.matching.total}} </span> <br>
                                            Total
                                        </div>
                                    </div>
                                    <div class="p-col-2">
                                        <Divider layout="vertical" />
                                    </div>
                                    <div class="p-col-5">
                                        <div style="text-align: center">
                                            <span style="font-size: 40px;"> {{this.kegiatanData.data.matching.complete}} </span>
                                            <br>
                                            Complete
                                        </div>
                                    </div>
                                    <div class="p-col-12 p-mt-4">
                                        <!-- <ProgressBar style="color:white;"
                                            :value="((this.kegiatanData.data.matching.complete/this.kegiatanData.data.matching.total)*100).toFixed(2)" /> -->
                                        <ProgressBar :value="Number(((this.kegiatanData.data.matching.complete/this.kegiatanData.data.matching.total)*100).toFixed(2))">
                                            <div style="color: white !important">{{((this.kegiatanData.data.matching.complete/this.kegiatanData.data.matching.total)*100).toFixed(2)}}%</div>
                                        </ProgressBar>
                                    </div>
                                </div>
                            </template>
                        </Card>
                    </div>

                    <!-- Assessment Status -->
                    <div class="p-col-12 p-lg-6 p-md-6 p-sm-6" v-if="this.kegiatanData !== null" style="padding-right: 31px;">
                        <Card class="custom-card-matcha animate__animated animate__fadeIn"  style="border-radius: 0.357rem; margin-top: 15px; padding: 15px">
                            <template #title>
                                <div style="text-align: center; text-transform: uppercase;">Assessment</div>
                            </template>
                            <template #content>
                                <div class="p-grid ">
                                    <div class="p-col-5">
                                        <div style="text-align: center">
                                            <span style="font-size: 40px;"> {{this.kegiatanData.data.assessment.total}} </span> <br>
                                            Total
                                        </div>
                                    </div>

                                    <div class="p-col-2">
                                        <Divider layout="vertical" />
                                    </div>
                                    <div class="p-col-5">

                                        <div style="text-align: center">
                                            <span style="font-size: 40px;"> {{this.kegiatanData.data.assessment.complete}} </span>
                                            <br>
                                            Complete
                                        </div>
                                    </div>
                                    <div class="p-col-12 p-mt-4">
                                        <!-- <ProgressBar
                                            :value="((this.kegiatanData.data.assessment.complete/this.kegiatanData.data.assessment.total)*100).toFixed(2)" /> -->
                                        <ProgressBar :value="Number(((this.kegiatanData.data.assessment.complete/this.kegiatanData.data.assessment.total)*100).toFixed(2))">
                                            <div style="color: white !important">{{((this.kegiatanData.data.assessment.complete/this.kegiatanData.data.assessment.total)*100).toFixed(2)}}%</div>
                                        </ProgressBar>
                                    </div>
                                </div>
                            </template>
                        </Card>
                    </div>
                </div>

                <Skeleton v-if="dataLoading" width="calc(100% - 30px)" height="15rem"
                    style="margin-top: 10px; margin-left: 17px; border-radius: 0.357rem; background-color: #8080802b;" />            

                <div class="p-col-12 p-lg-12" v-if="kegiatanData !== null" style="padding-left: 0; padding-right: 0;">
                    <DataTable style="box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%);" 
                        stateStorage="session" stateKey="dt-state-users"
                        :value="kegiatanData.data.users" v-model:filters="filters" filterDisplay="menu"
                        :globalFilterFields="['nama','jumlah_matching','sisa_matching','jumlah_assessment','sisa_assessment']"
                        :paginator="true" responsiveLayout="scroll" :rows="10" dataKey="id" :rowHover="true"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        :rowsPerPageOptions="[10,25,50]"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
                        class="animate__animated animate__fadeIn ccm-custom p-mt-2">
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
                                    <InputText type="text" v-model="filters['global'].value" placeholder="Keyword Search" />
                                </span>
                            </div>
                        </template>                
                        <Column field="nama" header="Nama"></Column>
                        <Column field="jumlah_matching" header="Jumlah Matching"></Column>
                        <Column field="sisa_matching" header="Sisa Matching"></Column>
                        <Column field="jumlah_assessment" header="Jumlah Assessment"></Column>
                        <Column field="sisa_assessment" header="Sisa Assessment "></Column>
                    </DataTable>
                </div>

            </div>
        </div>            
    </div>
</template>

<script scoped>
    import ProgressBar from 'primevue/progressbar'
    import Breadcrumb from 'primevue/breadcrumb';
    import DataService from '../services/DataService';
    import InputText from 'primevue/inputtext';
    import Skeleton from 'primevue/skeleton';
    import Toast from 'primevue/toast';
    import Checkbox from 'primevue/checkbox';
    import RadioButton from 'primevue/radiobutton';
    import {
        FilterMatchMode,
    } from 'primevue/api';
    export default {
        components: {
            ProgressBar,
            Breadcrumb,
            InputText,
            Skeleton,
            Toast,
            Checkbox,
            RadioButton
        },
        data() {
            return {
                filterStatus: null,
                filters: {
                    'global': {
                        value: null,
                        matchMode: FilterMatchMode.CONTAINS
                    },
                },
                dataLoading: false,
                home: {
                    icon: 'pi pi-home',
                    to: '/'
                },
                items: [{
                    label: 'Dashboard'
                }, ],
                kegiatanOptions: null,
                selectedKegiatan: null,
                kegiatanData: null
            }
        },
        watch: {
            async filterStatus(newStatus, olderStatus) {
                if(newStatus == null) {
                    this.kegiatanOptions = null
                    this.selectedKegiatan = null
                    this.kegiatanData = null
                    this.getAllKegiatan()
                    return
                }
                let status = newStatus.split("-"),
                    statusTxt = status[1] == '1' ? 'active' : (status[1] == '0' ? 'done' : status[1])  
                try {
                    this.kegiatanOptions = null
                    this.selectedKegiatan = null
                    this.kegiatanData = null
                    const result = await DataService.getKegiatanFilter(status[0], statusTxt)
                    this.kegiatanOptions = result.data
                } catch (error) {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Error!',
                        detail: 'Something went wrong!',
                        life: 2000
                    });
                    console.log(error)
                }                                
            }
        },
        created() {
            this.getAllKegiatan()
        },

        computed: {
            currentUser() {
                return this.$store.state.auth.user
            }
        },
        methods: {
            clearFilterKegiatan(){
                this.filterStatus = null
            },
            async getAllKegiatan() {
                try {
                    const result = await DataService.getAllKegiatan()
                    this.kegiatanOptions = result.data
                } catch (error) {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Error!',
                        detail: 'Something went wrong!',
                        life: 2000
                    });
                    console.log(error)   
                }                            
            },
            async getKegiatanData(selectedKegiatan) {
                this.kegiatanData = null
                if(!selectedKegiatan) return
                try {
                    this.dataLoading = true
                    const result = await DataService.getKegiatanData(selectedKegiatan['id_kegiatan'])
                    this.kegiatanData = result.data
                    this.dataLoading = false                    
                } catch (error) {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Error!',
                        detail: 'Something went wrong!',
                        life: 2000
                    });
                    console.log(error) 
                }
                
                // await DataService.getKegiatanData(selectedKegiatan['id_kegiatan'])
                //     .then(response => {
                //         this.kegiatanData = response.data
                //         console.log('KegiatanData', response.data)
                //     })
                //     .catch(error => {
                //         console.log(error)
                //     })
            }
        }
    }
</script>

<style scoped>

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

::v-deep(th) {
    vertical-align: middle !important;
}

::v-deep(tr td) {
    padding: 20px !important;        
}

::v-deep(thead th) {
    background-color: #f3f2f7 !important;
    vertical-align: top;
    text-transform: uppercase;
    font-size: .857rem;
    letter-spacing: .5px;
    text-align: center !important;
    height: 80px;
}

::v-deep(div.p-column-header-content) {
    width: 100%;
}

::v-deep(span.p-column-title) {
    margin: 0 auto;
}
</style>