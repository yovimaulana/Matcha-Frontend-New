<template>
    <div class="p-grid p-p-0 p-p-sm-1 p-p-md-2 p-p-lg-3 ">
        <div class="p-col-12 p-lg-12">
            <Breadcrumb class="custom-breadcrumb" :home="home" :model="items" />
        </div> 
        <!-- UNIT STATISTIK -->
        <div class="p-md-4 p-sm-12">
            <Card class="custom-card-matcha">
                <template #title>
                    <div style="font-size: 1rem; text-transform: uppercase; margin-bottom: 10px">Variabel Esensial</div>                    
                    <Dropdown v-if="dataVariableEsensial != null" style="width: 100%" :filter="true" @change="variableEsensialChange(variableEsensialSelected)" v-model="variableEsensialSelected" :options="variableEsensialOption" optionLabel="name" placeholder="Pilih Variable Esensial" />
                </template>
                <template #content>
                    <Skeleton v-show="dataChartEsensial == null" height="15rem" />
                    <div style="margin-bottom: 10px; background-color: #f89494;padding: 10px;color: white;" v-if="addInfoVarEsensial != null">{{addInfoVarEsensial}}</div>
                    <DataTable style="margin-bottom: 10px" v-if="dataChartEsensial != null" :value="dataTableEsensial" responsiveLayout="scroll">
                        <template #empty>
                            <h5>Data tidak tersedia!</h5>
                        </template>
                        <Column field="t_null" header="NULL">
                            <template #body="col">
                                <div>
                                    {{col.data.t_null.toLocaleString()}}
                                </div>                                
                            </template>
                        </Column>
                        <Column field="t_empty" header="EMPTY">
                            <template #body="col">
                                <div>
                                    {{col.data.t_empty.toLocaleString()}}
                                </div>                                
                            </template>
                        </Column>
                        <Column field="t_total" header="Terisi">
                            <template #body="col">
                                <div>
                                    {{col.data.t_total.toLocaleString()}}
                                </div>                                
                            </template>
                        </Column>
                    </DataTable>
                    <Chart v-if="dataChartEsensial != null" type="pie" :data="dataChartEsensial" :options="lightOptions" />
                    <div v-show="onErrorLoadDataVariableEsensial" style="text-align: center">
                        <img class="errImg" src="../assets/err404.png" alt="Error Image">                    
                        <Button @click="this.getResumeVariableEsensial()" v-tooltip.right="'Click to reload data!'" class="p-button-danger p-button-outlined onclick-btn-custom" style="margin-top: 5px; margin-bottom: 15px" label="RELOAD" icon="pi pi-refresh" />
                    </div> 
                </template>
            </Card>
        </div>
        <div class="p-md-8 p-sm-12">            
            <Card class="custom-card-matcha">
                <template #title>
                    <div class="p-grid">
                        <div class="p-col">
                            <div style="font-size: 1rem; text-transform: uppercase;">Jumlah usaha menurut {{ resumeJudul == null ? 'unit statistik' : resumeJudul }}</div>
                        </div>
                        <div class="p-col" style="text-align: right">
                            <Dropdown @change="getDataResume(resumeSelected)" v-model="resumeSelected" :options="resumeOption" optionLabel="name" placeholder="Pilih Resume" />
                        </div>                        
                    </div>
                </template>
                <template #content>
                    <div class="p-col-12" style="display: table; padding-left: 0;">
                        <div style="background-color: #f34c4c99; height: 20px; width: 40px;display: table-cell;vertical-align: middle;">
                        </div>
                        <span style="display: table-cell;vertical-align: middle;padding-left: 10px;">Isian yang perlu diperbaiki!</span>
                    </div>
                    <Skeleton v-show="onLoadData" height="15rem" />
                    <!-- Unit Statistik -->
                    <div v-if="dataUnitStatistik != null">
                        <DataTable :value="dataUnitStatistik" responsiveLayout="scroll"
                        class="animate__animated animate__fadeIn"
                        style="border-radius: 18px;">
                            <template #empty>
                                <h5>Data tidak tersedia!</h5>
                            </template>
                            <Column field="unit_statistik" header="Unit Statistik">
                                <template #body="col">
                                    <div v-if="['SBR_ANCILLARY_UNIT', 'SBR_ENTERPRISE', 'SBR_ENTERPRISE_GROUP', 'SBR_ESTABLISHMENT'].includes(col.data.unit_statistik)">
                                        {{col.data.unit_statistik}}
                                    </div>
                                    <div v-else class="wrong-data">
                                        {{col.data.unit_statistik == null ? '<NULL>' : (col.data.unit_statistik == '' ? '<EMPTY>' : col.data.unit_statistik)}}
                                    </div>
                                </template>
                            </Column>
                            <Column field="total" header="Total">
                                <template #body="col">
                                    <div v-if="['SBR_ANCILLARY_UNIT', 'SBR_ENTERPRISE', 'SBR_ENTERPRISE_GROUP', 'SBR_ESTABLISHMENT'].includes(col.data.unit_statistik)">
                                        {{col.data.total.toLocaleString()}}
                                    </div>
                                    <div v-else class="wrong-data">
                                        {{col.data.total.toLocaleString()}}
                                    </div>
                                </template>
                            </Column>
                            <template #footer>
                                <div style="font-size: larger; text-align: center;">
                                    Total : {{ dataUnitStatistik.reduce((a,b) => a + parseInt(b.total), 0).toLocaleString() }}
                                </div>
                                
                            </template>
                        </DataTable>
                        <div v-show="onErrorLoadUnitStatistik" style="text-align: center">
                            <img class="errImg" src="../assets/err404.png" alt="Error Image">                    
                            <Button @click="this.getUsahaByUnitStatistik()" v-tooltip.right="'Click to reload data!'" class="p-button-danger p-button-outlined onclick-btn-custom" style="margin-top: 5px; margin-bottom: 15px" label="RELOAD" icon="pi pi-refresh" />
                        </div>
                    </div>  
                    
                    <!-- Status Aktif -->
                    <div v-if="dataStatusAktif != null">
                        <DataTable  :value="dataStatusAktif" responsiveLayout="scroll"
                        class="animate__animated animate__fadeIn"
                        style="border-radius: 18px;">
                            <template #empty>
                                <h5>Data tidak tersedia!</h5>
                            </template>
                            <Column field="nama" header="Status">
                                <template #body="col">
                                    <div v-if="col.data.kode == null || col.data.kode == ''" class="wrong-data">
                                        {{col.data.nama == null ? '<NULL>' : (col.data.nama == '' ? '<EMPTY>' : col.data.nama)}}
                                    </div>
                                    <div v-else>
                                        {{col.data.nama}}
                                    </div>
                                </template>
                            </Column>
                            <Column field="total" header="Total">
                                <template #body="col">
                                    <div v-if="col.data.kode == null || col.data.kode == ''" class="wrong-data">
                                        {{col.data.total.toLocaleString()}}
                                    </div>
                                    <div v-else>
                                        {{col.data.total.toLocaleString()}}
                                    </div>
                                </template>
                            </Column>                        
                            <template #footer>
                                <div style="font-size: larger; text-align: center;">
                                    Total : {{ dataStatusAktif.reduce((a,b) => a + parseInt(b.total), 0).toLocaleString() }}
                                </div>
                            </template>
                        </DataTable>
                        <div v-show="onErrorLoadStatusAktif" style="text-align: center">
                            <img class="errImg" src="../assets/err404.png" alt="Error Image">                    
                            <Button @click="this.getUsahaByStatusAktif()" v-tooltip.right="'Click to reload data!'" class="p-button-danger p-button-outlined onclick-btn-custom" style="margin-top: 5px; margin-bottom: 15px" label="RELOAD" icon="pi pi-refresh" />
                        </div>
                    </div>

                    <!-- Sektor Institusi -->
                    <div v-if="dataSektorInstitusi != null">
                        <DataTable  :value="dataSektorInstitusi" responsiveLayout="scroll"
                        class="animate__animated animate__fadeIn"
                        style="border-radius: 18px;">
                            <template #empty>
                                <h5>Data tidak tersedia!</h5>
                            </template>
                            <Column field="nama" header="Sektor Institusi">
                                <template #body="col">
                                    <div v-if="col.data.nama == null" class="wrong-data">
                                        {{col.data.nama == null ? '<NULL>' : col.data.nama}}
                                    </div>
                                    <div v-else>
                                        {{col.data.nama}}
                                    </div>
                                </template>
                            </Column>
                            <Column field="total" header="Total">
                                <template #body="col">
                                    <div v-if="col.data.nama == null" class="wrong-data">
                                        {{col.data.total.toLocaleString()}}
                                    </div>
                                    <div v-else>
                                        {{col.data.total.toLocaleString()}}
                                    </div>
                                </template>
                            </Column>                        
                            <template #footer>
                                <div style="font-size: larger; text-align: center;">
                                    Total : {{ dataSektorInstitusi.reduce((a,b) => a + parseInt(b.total), 0).toLocaleString() }}
                                </div>
                            </template>
                        </DataTable>
                        <div v-show="onErrorLoadSektorInstitusi" style="text-align: center">
                            <img class="errImg" src="../assets/err404.png" alt="Error Image">                    
                            <Button @click="this.getUsahaBySektorInstitusi()" v-tooltip.right="'Click to reload data!'" class="p-button-danger p-button-outlined onclick-btn-custom" style="margin-top: 5px; margin-bottom: 15px" label="RELOAD" icon="pi pi-refresh" />
                        </div> 
                    </div>

                    <!-- Badan Usaha -->
                    <div v-if="dataBadanUsaha != null">
                        <DataTable  :value="dataBadanUsaha" responsiveLayout="scroll"
                        class="animate__animated animate__fadeIn"
                        style="border-radius: 18px;">
                            <template #empty>
                                <h5>Data tidak tersedia!</h5>
                            </template>
                            <Column field="nama" header="Badan Hukum/Usaha">
                                <template #body="col">
                                    <div v-if="col.data.nama == null" class="wrong-data">
                                        {{col.data.nama == null ? '<NULL>' : col.data.nama}}
                                    </div>
                                    <div v-else>
                                        {{col.data.nama}}
                                    </div>
                                </template>
                            </Column>
                            <Column field="total" header="Total">
                                <template #body="col">
                                    <div v-if="col.data.nama == null" class="wrong-data">
                                        {{col.data.total.toLocaleString()}}
                                    </div>
                                    <div v-else>
                                        {{col.data.total.toLocaleString()}}
                                    </div>
                                </template>
                            </Column>                        
                            <template #footer>
                                <div style="font-size: larger; text-align: center;">
                                    Total : {{ dataBadanUsaha.reduce((a,b) => a + parseInt(b.total), 0).toLocaleString() }}
                                </div>
                            </template>
                        </DataTable>
                        <div v-show="onErrorLoadBadanUsaha" style="text-align: center">
                            <img class="errImg" src="../assets/err404.png" alt="Error Image">                    
                            <Button @click="this.getUsahaByBadanUsaha()" v-tooltip.right="'Click to reload data!'" class="p-button-danger p-button-outlined onclick-btn-custom" style="margin-top: 5px; margin-bottom: 15px" label="RELOAD" icon="pi pi-refresh" />
                        </div> 
                    </div>

                    <!-- Jaringan Usaha -->
                    <div v-if="dataJaringanUsaha != null">
                        <DataTable  :value="dataJaringanUsaha" responsiveLayout="scroll"
                        class="animate__animated animate__fadeIn"
                        style="border-radius: 18px;">
                            <template #empty>
                                <h5>Data tidak tersedia!</h5>
                            </template>
                            <Column field="nama" header="Jaringan Usaha">
                                <template #body="col">
                                    <div v-if="col.data.nama == null" class="wrong-data">
                                        {{col.data.nama == null ? '<NULL>' : col.data.nama}}
                                    </div>
                                    <div v-else>
                                        {{col.data.nama}}
                                    </div>
                                </template>
                            </Column>
                            <Column field="total" header="Total">
                                <template #body="col">
                                    <div v-if="col.data.nama == null" class="wrong-data">
                                        {{col.data.total.toLocaleString()}}
                                    </div>
                                    <div v-else>
                                        {{col.data.total.toLocaleString()}}
                                    </div>
                                </template>
                            </Column>                        
                            <template #footer>
                                <div style="font-size: larger; text-align: center;">
                                    Total : {{ dataJaringanUsaha.reduce((a,b) => a + parseInt(b.total), 0).toLocaleString() }}
                                </div>
                            </template>
                        </DataTable>
                        <div v-show="onErrorLoadJaringanUsaha" style="text-align: center">
                            <img class="errImg" src="../assets/err404.png" alt="Error Image">                    
                            <Button @click="this.getUsahaByJaringanUsaha()" v-tooltip.right="'Click to reload data!'" class="p-button-danger p-button-outlined onclick-btn-custom" style="margin-top: 5px; margin-bottom: 15px" label="RELOAD" icon="pi pi-refresh" />
                        </div> 
                    </div>

                    <!-- Skala Usaha -->
                    <div v-if="dataSkalaUsaha != null">
                        <DataTable  :value="dataSkalaUsaha" responsiveLayout="scroll"
                        class="animate__animated animate__fadeIn"
                        style="border-radius: 18px;">
                            <template #empty>
                                <h5>Data tidak tersedia!</h5>
                            </template>
                            <Column field="nama" header="Skala Usaha">
                                <template #body="col">
                                    <div v-if="['SBR_BESAR', 'SBR_BESAR_TENTATIF', 'SBR_KECIL', 'SBR_MENENGAH', 'SBR_MIKRO'].includes(col.data.nama)">
                                        {{col.data.nama}}
                                    </div>
                                    <div v-else class="wrong-data">
                                        {{col.data.nama == null ? '<NULL>' : (col.data.nama == '' ? '<EMPTY>' : col.data.nama)}}
                                    </div>
                                </template>
                            </Column>
                            <Column field="total" header="Total">
                                <template #body="col">
                                    <div v-if="['SBR_BESAR', 'SBR_BESAR_TENTATIF', 'SBR_KECIL', 'SBR_MENENGAH', 'SBR_MIKRO'].includes(col.data.nama)">
                                        {{col.data.total.toLocaleString()}}
                                    </div>
                                    <div v-else class="wrong-data">
                                        {{col.data.total.toLocaleString()}}
                                    </div>
                                </template>
                            </Column>                        
                            <template #footer>
                                <div style="font-size: larger; text-align: center;">
                                    Total : {{ dataSkalaUsaha.reduce((a,b) => a + parseInt(b.total), 0).toLocaleString() }}
                                </div>
                            </template>
                        </DataTable>
                        <div v-show="onErrorLoadSkalaUsaha" style="text-align: center">
                            <img class="errImg" src="../assets/err404.png" alt="Error Image">                    
                            <Button @click="this.getUsahaBySkalaUsaha()" v-tooltip.right="'Click to reload data!'" class="p-button-danger p-button-outlined onclick-btn-custom" style="margin-top: 5px; margin-bottom: 15px" label="RELOAD" icon="pi pi-refresh" />
                        </div> 
                    </div>
                </template>
            </Card>
        </div>        

        <!-- USAHA BY PROVINSI -->
        <div class="p-col-6">
            <Skeleton v-show="onLoadByProvinsi" height="15rem" />
            <Card class="custom-card-matcha" v-if="dataByProvinsi != null">
                <template #title>
                    <div class="p-grid">
                        <div class="p-col-12">
                            <div style="font-size: 1rem; text-transform: uppercase;">Jumlah usaha menurut provinsi</div>
                        </div>
                    </div>
                </template>
                <template #content>
                    <Chart type="bar" :data="dataByProvinsi" :options="basicOptions" />                    
                    <div v-show="onErrorLoadByProvinsi" style="text-align: center">
                        <img class="errImg" src="../assets/err404.png" alt="Error Image">                    
                        <Button @click="this.getUsahaByProvinsi()" v-tooltip.right="'Click to reload data!'" class="p-button-danger p-button-outlined onclick-btn-custom" style="margin-top: 5px; margin-bottom: 15px" label="RELOAD" icon="pi pi-refresh" />
                    </div> 
                </template>
            </Card>
        </div>

        <!-- USAHA BY KATEGORI KBLI -->
        <div class="p-col-6">
            <Skeleton v-show="onLoadByKategoriKBLI" height="15rem" />
            <Card class="custom-card-matcha" v-if="dataByKategoriKBLI != null">
                <template #title>
                    <div class="p-grid">
                        <div class="p-col-12">
                            <div style="font-size: 1rem; text-transform: uppercase;">Jumlah usaha menurut kategori KBLI</div>
                        </div>
                    </div>
                </template>
                <template #content>
                    <Chart type="bar" :data="dataByKategoriKBLI" :options="basicOptions" />                    
                    <div v-show="onErrorLoadByKategoriKBLI" style="text-align: center">
                        <img class="errImg" src="../assets/err404.png" alt="Error Image">                    
                        <Button @click="this.getUsahaByKategoriKBLI()" v-tooltip.right="'Click to reload data!'" class="p-button-danger p-button-outlined onclick-btn-custom" style="margin-top: 5px; margin-bottom: 15px" label="RELOAD" icon="pi pi-refresh" />
                    </div> 
                </template>
            </Card>
        </div>
        <!-- <div class="p-grid">            
            <div class="p-col-6">
                <Card class="custom-card-matcha">
                    <template #title>
                        <div class="p-grid">
                            <div class="p-col-12">
                                <div style="font-size: 1rem">Unit Statistik</div>
                            </div>                    
                        </div>
                    </template>
                    <template #content>
                        <Skeleton v-show="onLoadUnitStatistik" height="15rem" />
                        <div v-if="dataUnitStatistik != null">                    
                            <Chart type="pie" :data="dataUnitStatistik" :options="lightOptions" />
                        </div>
                        <div v-show="onErrorLoadUnitStatistik" style="text-align: center">
                            <img class="errImg" src="../assets/err404.png" alt="Error Image">                    
                            <Button @click="this.getUsahaByUnitStatistikForChart()" v-tooltip.right="'Click to reload data!'" class="p-button-danger p-button-outlined onclick-btn-custom" style="margin-top: 5px; margin-bottom: 15px" label="RELOAD" icon="pi pi-refresh" />
                        </div>                     
                    </template>
                </Card>
            </div>
            <div class="p-col-6">
                <Card class="custom-card-matcha">
                    <template #title>
                        <div class="p-grid">
                            <div class="p-col-12">
                                <div style="font-size: 1rem">Unit Statistik</div>
                            </div>                    
                        </div>
                    </template>
                    <template #content>
                        <Skeleton v-show="onLoadUnitStatistik" height="15rem" />
                        <div v-if="dataUnitStatistik2 != null">                    
                            <Chart type="polarArea" :data="dataUnitStatistik2" :options="lightOptions" />
                        </div>
                        <div v-show="onErrorLoadUnitStatistik" style="text-align: center">
                            <img class="errImg" src="../assets/err404.png" alt="Error Image">                    
                            <Button @click="this.getUsahaByUnitStatistikForChart()" v-tooltip.right="'Click to reload data!'" class="p-button-danger p-button-outlined onclick-btn-custom" style="margin-top: 5px; margin-bottom: 15px" label="RELOAD" icon="pi pi-refresh" />
                        </div>                     
                    </template>
                </Card>
            </div>
        </div> -->
        
        
        <Toast />
        <Loading v-model:active="loadingDialog" :is-full-page="true" :color="'#86d166'" :background-color="'black'"
            :opacity="0.75">
            <slot>
                <MyLoading></MyLoading>
            </slot>
        </Loading>  
    </div>
</template>

<script scoped>
    import Breadcrumb from 'primevue/breadcrumb';
    import DataService from '../services/DataService';
    import Card from 'primevue/card';
    import Skeleton from 'primevue/skeleton';
    import Button from 'primevue/button';
    import Toast from 'primevue/toast';
    import exportFromJSON from "export-from-json";    
    import MyLoading from '../components/MyLoading2.vue'
    import Loading from 'vue-loading-overlay';
    import 'vue-loading-overlay/dist/vue-loading.css';
    import Chart from 'primevue/chart'
    // import UserService from '../services/UserService'
    export default {
        components: {
            Breadcrumb,
            Card,
            Skeleton,
            Button,
            Toast,
            exportFromJSON,
            Loading,
            MyLoading,
            Chart
        },
        data() {
            return {   
                resumeOption: [
                    {name: 'Unit Statistik', value: '1'},
                    {name: 'Status Aktif', value: '2'},
                    {name: 'Sektor Institusi', value: '3'},     
                    {name: 'Badan Hukum/Usaha', value: '4'},    
                    {name: 'Jaringan Usaha', value: '5'}, 
                    {name: 'Skala Usaha', value: '6'},                
                ],
                variableEsensialOption: [
                    {name: 'Kode Provinsi', value: ['provinsi']},
                    {name: 'Kode Kabupaten/Kota', value: ['kabupaten']},
                    {name: 'Kode Kecamatan', value: ['kecamatan']},     
                    {name: 'Kode Kelurahan/Desa', value: ['kelurahan']},    
                    {name: 'Nama Usaha/Perusahaan', value: ['namaPerusahaan']}, 
                    {name: 'Nomor Induk Berusaha (NIB)', value: ['nib']},
                    {name: 'Alamat Usaha/Perusahaan', value: ['alamatPerusahaan']},
                    {name: 'Nomor Telepon', value: ['nomorTeleponPerusahaan', 'tidakPunyaNomorTelepon']},
                    {name: 'Email Usaha/Perusahaan', value: ['emailPerusahaan', 'tidakPunyaEmail']},
                    {name: 'Tahun Usaha/Perusahaan Berdiri', value: ['tahunBerdiri']},
                    {name: 'Tahun Usaha/Perusahaan Beroperasi', value: ['tahunBeroperasi']},
                    {name: 'Kondisi Usaha/Perusahaan (Status Aktif)', value: ['statusPerusahaan']},
                    {name: 'Bentuk Badan Usaha', value: ['badanHukum']},
                    {name: 'Status Penanaman Modal', value: ['statusKepemilikan']},
                    {name: 'Unit Institusi', value: ['sektorInstitusi']},
                    {name: 'Jaringan Usaha/Perusahaan', value: ['jaringanUsaha']},
                    {name: 'Nilai Pendapatan Usaha', value: ['pendapatan']},
                    {name: 'Total Pengeluaran Usaha', value: ['pengeluaran']},
                    {name: 'Jumlah Tenaga Kerja', value: ['tenagakerja-asing', 'tenagakerja-lokal']},
                    {name: 'Nilai Pengeluaran untuk Upah dan/ Gaji', value: ['upah-asing', 'upah-lokal']},
                    {name: 'Nilai Aset', value: ['aset']},
                ],
                variableEsensialSelected: null,
                resumeJudul: null,
                resumeSelected: null,
                basicOptions: {
                    animations: {
                        tension: {
                            duration: 1000,
                            easing: 'linear',
                            from: 1,
                            to: 0,
                            loop: true
                        }
                    },
                    plugins: {
                        legend: {
                            labels: {
                                color: '#495057'
                            }
                        }
                    },
                    scales: {
                        x: {
                            ticks: {
                                color: '#495057'
                            },
                            grid: {
                                color: '#ebedef'
                            }
                        },
                        y: {
                            ticks: {
                                color: '#495057'
                            },
                            grid: {
                                color: '#ebedef'
                            }
                        }
                    }
                },
                lightOptions: {
                    plugins: {
                        legend: {
                            labels: {
                                color: '#495057'
                            }
                        }
                    }
                },
                home: {
                    icon: 'pi pi-home',
                    to: '/'
                },
                items: [{
                        label: 'Analytics'
                    },

                ],
                onLoadUnitStatistik: false,
                onErrorLoadUnitStatistik: false,
                loadingDialog: false  ,
                dataUnitStatistik: null,  
                dataUnitStatistik2: null,
                lightOptions: {
                    plugins: {
                        legend: {
                            labels: {
                                color: '#495057'
                            }
                        }
                    }
                },
                dataStatusAktif: null,
                onLoadStatusAktif : false,
                onErrorLoadStatusAktif : false,
                
                dataByProvinsi: null,
                onLoadByProvinsi : false,
                onErrorLoadByProvinsi : false,

                dataSektorInstitusi: null,
                onLoadSektorInstitusi : false,
                onErrorLoadSektorInstitusi : false,

                dataBadanUsaha: null,
                onErrorLoadBadanUsaha : false,

                dataJaringanUsaha: null,
                onErrorLoadJaringanUsaha : false,

                dataSkalaUsaha: null,
                onErrorLoadSkalaUsaha : false,

                onLoadData: false,

                dataByKategoriKBLI: null,
                onLoadByKategoriKBLI : false,
                onErrorLoadByKategoriKBLI : false,

                dataVariableEsensial: null,
                onErrorLoadDataVariableEsensial: false,
                dataChartEsensial: null,
                dataTableEsensial: null,      
                addInfoVarEsensial: null          
            }
        },
        mounted() {},
        watch: {},
        created() {       
            this.getDataTableOnLoad()
            this.getUsahaByProvinsi()
            this.getUsahaByKategoriKBLI()
            this.getResumeVariabelEsensial()
        },

        computed: {            
            currentUser() {
                return this.$store.state.auth.user
            }
        },
        methods: {
            async getResumeVariabelEsensial() {
                try {
                    const result = await DataService.getResumeVariabelEsensial()
                    this.dataVariableEsensial = result.data.data
                    this.dataChartEsensial = []
                    console.log(result.data.data)
                } catch (error) {
                    console.log(error)
                }
            },
            async getUsahaBySkalaUsaha() {
                try {
                    // this.onLoadSektorInstitusi = true
                    this.onLoadData = true
                    const result = await DataService.getResumeSkalaUsaha()
                    this.dataSkalaUsaha = result.data.data  
                    // this.onLoadSektorInstitusi = false
                    this.onLoadData = false
                } catch (error) {
                    console.log(error)
                    // this.onLoadSektorInstitusi = false
                    this.onLoadData = false
                    this.onErrorLoadSkalaUsaha = true
                    this.$toast.add({severity:'error', summary: 'Error Occured!', detail:'Gagal menampilkan data :(', life: 1500});   
                }
            },
            async getUsahaByJaringanUsaha() {
                try {
                    // this.onLoadSektorInstitusi = true
                    this.onLoadData = true
                    const result = await DataService.getResumeJaringanUsaha()
                    this.dataJaringanUsaha = result.data.data  
                    // this.onLoadSektorInstitusi = false
                    this.onLoadData = false
                } catch (error) {
                    console.log(error)
                    // this.onLoadSektorInstitusi = false
                    this.onLoadData = false
                    this.onErrorLoadJaringanUsaha = true
                    this.$toast.add({severity:'error', summary: 'Error Occured!', detail:'Gagal menampilkan data :(', life: 1500});   
                }
            },
            async getUsahaByBadanUsaha() {
                try {
                    // this.onLoadSektorInstitusi = true
                    this.onLoadData = true
                    const result = await DataService.getResumeBadanUsaha()
                    this.dataBadanUsaha = result.data.data  
                    // this.onLoadSektorInstitusi = false
                    this.onLoadData = false
                } catch (error) {
                    console.log(error)
                    // this.onLoadSektorInstitusi = false
                    this.onLoadData = false
                    this.onErrorLoadBadanUsaha = true
                    this.$toast.add({severity:'error', summary: 'Error Occured!', detail:'Gagal menampilkan data :(', life: 1500});   
                }
            },
            loadDataTableDefault() {
                this.dataUnitStatistik = null
                this.dataStatusAktif = null
                this.dataSektorInstitusi = null
                this.dataBadanUsaha = null
                this.dataJaringanUsaha = null
                this.dataSkalaUsaha = null
            },
            getDataTableOnLoad() {
                this.loadDataTableDefault()                    
                this.getUsahaByUnitStatistik()
            },
            variableEsensialChange(esensialSelected) {
                const varEsensial = esensialSelected.value
                this.dataChartEsensial = null

                console.log(varEsensial)
                console.log(this.dataVariableEsensial[varEsensial[0]])


                this.addInfoVarEsensial = varEsensial.length == 2 ? `Terdapat ${this.dataVariableEsensial[varEsensial[1]].total.toLocaleString()} perusahaan yang tidak memiliki data ${esensialSelected.name}` : null
                this.dataTableEsensial = [{'t_null': this.dataVariableEsensial[varEsensial[0]].total_null, 't_empty': this.dataVariableEsensial[varEsensial[0]].total_empty, 't_total': this.dataVariableEsensial[varEsensial[0]].total }]
                this.dataChartEsensial = {
                    labels: ['NULL','EMPTY','Terisi'],
                    datasets: [
                        {
                            data: [this.dataVariableEsensial[varEsensial[0]].total_null, this.dataVariableEsensial[varEsensial[0]].total_empty, this.dataVariableEsensial[varEsensial[0]].total],
                            backgroundColor: ["#42A5F5","#FFA726", "#66BB6A"],
                            hoverBackgroundColor: ["#64B5F6","#FFB74D", "#81C784"]
                        }
                    ]
                }                
                
            },
            getDataResume(resume) {
                this.resumeJudul = resume.name
                this.loadDataTableDefault()
                switch(resume.value) {
                    case '1':
                        this.getUsahaByUnitStatistik()
                        break
                    case '2':
                        this.getUsahaByStatusAktif()
                        break
                    case '3':
                        this.getUsahaBySektorInstitusi()
                        break
                    case '4':
                        this.getUsahaByBadanUsaha()
                        break
                    case '5':
                        this.getUsahaByJaringanUsaha()
                        break
                    case '6':
                        this.getUsahaBySkalaUsaha()
                        break
                    default:
                        break
                }
            },
            async getUsahaBySektorInstitusi() {
                try {
                    // this.onLoadSektorInstitusi = true
                    this.onLoadData = true
                    const result = await DataService.getResumeSektorInstitusi()
                    this.dataSektorInstitusi = result.data.data  
                    // this.onLoadSektorInstitusi = false
                    this.onLoadData = false
                } catch (error) {
                    console.log(error)
                    // this.onLoadSektorInstitusi = false
                    this.onLoadData = false
                    this.onErrorLoadSektorInstitusi = true
                    this.$toast.add({severity:'error', summary: 'Error Occured!', detail:'Gagal menampilkan data :(', life: 1500});   
                }
            },
            getRandomColor() {
                const randomColor = Math.floor(Math.random()*16777215).toString(16);
                return {
                    'background': `#${randomColor}a6`,
                    'border': `#${randomColor}`
                }
            },
            async getUsahaByProvinsi() {
                try {
                    this.onLoadByProvinsi = true
                    const result = await DataService.getResumeByProvinsi()
                    const tempData = result.data.data
                    
                    let labels = []
                    let chartData = []
                    let chartBackgroundColor = []
                    let chartBorder = []
                    for(let i=0; i<tempData.length; i++) {
                        labels.push(tempData[i].nama == null ? '<NULL>' : tempData[i].nama)
                        chartData.push(tempData[i].total)
                        
                        const color = this.getRandomColor()
                        chartBackgroundColor.push(color.background)
                        chartBorder.push(color.border)
                    }

                    this.dataByProvinsi = {
                        labels: labels,
                        datasets: [{
                            label: 'Total',
                            data: chartData,
                            backgroundColor: chartBackgroundColor,
                            borderColor: chartBorder,
                            borderWidth: 1
                        }]
                    }
                    this.onLoadByProvinsi = false
                    
                } catch (error) {
                    console.log(error)
                    this.onLoadByProvinsi = false
                    this.onErrorLoadByProvinsi = true
                    this.$toast.add({severity:'error', summary: 'Error Occured!', detail:'Gagal menampilkan data :(', life: 1500});   
                }
            },
            async getUsahaByKategoriKBLI() {
                try {
                    this.onLoadByKategoriKBLI = true
                    const result = await DataService.getResumeByKategoriKBLI()
                    const tempData = result.data.data
                    
                    let labels = []
                    let chartData = []
                    let chartBackgroundColor = []
                    let chartBorder = []
                    for(let i=0; i<tempData.length; i++) {
                        labels.push(tempData[i].kategori == null ? '<NULL>' : (tempData[i].kategori == '' ? '<EMPTY>' : tempData[i].kategori))
                        chartData.push(tempData[i].total)
                        
                        const color = this.getRandomColor()
                        chartBackgroundColor.push(color.background)
                        chartBorder.push(color.border)
                    }

                    this.dataByKategoriKBLI = {
                        labels: labels,
                        datasets: [{
                            label: 'Total',
                            data: chartData,
                            backgroundColor: chartBackgroundColor,
                            borderColor: chartBorder,
                            borderWidth: 1
                        }]
                    }
                    this.onLoadByKategoriKBLI = false
                    
                } catch (error) {
                    console.log(error)
                    this.onLoadByKategoriKBLI = false
                    this.onErrorLoadByKategoriKBLI = true
                    this.$toast.add({severity:'error', summary: 'Error Occured!', detail:'Gagal menampilkan data :(', life: 1500});   
                }
            },
            async getUsahaByStatusAktif() {
                try {
                    // this.onLoadStatusAktif = true
                    this.onLoadData = true
                    const result = await DataService.getResumeStatusAktif()
                    this.dataStatusAktif = result.data.data 
                    this.onLoadData = false 
                    // this.onLoadStatusAktif = false
                } catch (error) {
                    console.log(error)
                    // this.onLoadStatusAktif = false
                    this.onLoadData = false
                    this.onErrorLoadStatusAktif = true
                    this.$toast.add({severity:'error', summary: 'Error Occured!', detail:'Gagal menampilkan data :(', life: 1500});   
                }
            },
            async getUsahaByUnitStatistik() {
                try {
                    // this.onLoadUnitStatistik = true
                    this.onLoadData = true
                    const result = await DataService.getResumeUnitStatistik()
                    this.dataUnitStatistik = result.data.data  
                    this.onLoadData = false
                    // this.onLoadUnitStatistik = false                  
                } catch (error) {
                    console.log(error)
                    this.onLoadData = false
                    // this.onLoadUnitStatistik = false
                    this.onErrorLoadUnitStatistik = true
                    this.$toast.add({severity:'error', summary: 'Error Occured!', detail:'Gagal menampilkan data :(', life: 1500});   
                }
            },
            async getUsahaByUnitStatistikForChart() {
                try {
                    this.onLoadUnitStatistik = true
                    const result = await DataService.getResumeUnitStatistik()
                    let wrongData = result.data.data.filter((data) => data.unit_statistik == null || !data.unit_statistik.includes('SBR') )
                    if(wrongData.length > 0) {
                        let labelTemp = []
                        let datasetTemp = []
                        let backgroundColorTemp = []
                        let backgroundColorHoverTemp = []
                        // let totalAll = result.data.data.reduce((acc, obj) => acc + obj.total, 0)
                        result.data.data.forEach((item, index) => {
                            labelTemp.push(item.unit_statistik)
                            datasetTemp.push(item.total)
                            const randomColor = Math.floor(Math.random()*16777215).toString(16);
                            backgroundColorTemp.push(`#${randomColor}`)
                            backgroundColorHoverTemp.push(`#${randomColor}a6`)
                        })
                        this.dataUnitStatistik = {}
                        this.dataUnitStatistik.labels = labelTemp
                        this.dataUnitStatistik.datasets = [
                            {
                                data: datasetTemp,
                                backgroundColor: backgroundColorTemp,
                                hoverBackgroundColor: backgroundColorHoverTemp
                            }

                        ]
                    }

                    
                    
                    
                    let labelxx = []
                    let datasetsxx = []
                    let bgxx = []
                    result.data.data.forEach((item, index) => {
                        labelxx.push(item.unit_statistik)                        
                        datasetsxx.push(item.total)
                        bgxx.push(`#${Math.floor(Math.random()*16777215).toString(16)}`)
                    })
                    this.dataUnitStatistik2 = {}
                    this.dataUnitStatistik2.labels = labelxx
                    this.dataUnitStatistik2.datasets = [{
                        backgroundColor: bgxx,
                        data: datasetsxx,
                        label: 'Unit Statistik'
                    }]

                    this.onLoadUnitStatistik = false
                } catch(error) {
                    console.log(error)
                    this.onLoadUnitStatistik = false
                    this.onErrorLoadUnitStatistik = true
                    this.$toast.add({severity:'error', summary: 'Error Occured!', detail:'Gagal menampilkan data :(', life: 1500});
                }
            },             
        }
    }
</script>

<style scoped>

    button.onclick-btn-custom {
        box-shadow: none !important;
    }    

    ::v-deep(thead th) {
        background-color: #f3f2f7 !important;
        vertical-align: top;
        text-transform: uppercase;
        font-size: .857rem;
        letter-spacing: .5px;
    }

    .errImg {        
        width: 20%;
        display: block;
        margin: 0 auto;
    }

    .errMsg {
        display: block; 
        margin: 0 auto;
        width: 70%;
        padding: 15px;
        font-size: 12px;
    }


    @media (max-width: 420px) {
        .errImg {
            width: 50%;
        }

        .errMsg {
            width: 100%;
        }

    }

    @media (min-width:421px) and (max-width: 720px) {
        .errImg {
            width: 30%;
        }
        .errMsg {
            width: 100%;
        }
    }   
    
    .wrong-data {
        color: white;
        font-weight: 700;
        background-color: #f34c4c99;      
    }

    ::v-deep(td) {
        padding: 0 !important;
    }

    td > div {
        padding: 15px !important;
        width: 100%;
        height: 100%;
        /* text-align: center; */
        /* cursor: pointer; */
    }
</style>