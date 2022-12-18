<template>
    <div>
        <Toast />
        <div class="p-col-12 p-lg-12">
            <Breadcrumb class="custom-breadcrumb" :home="home" :model="items" />
        </div>
        <div v-if="this.daftarUsers == null" class="p-grid">
            <div class="p-col-6">
                <Skeleton  width="50%" height="3rem"
            style="margin-top: 10px; margin-left: 17px; border-radius: 0.357rem; background-color: #8080802b;" />
            </div>
            <div class="p-col-6">
                <Skeleton  width="30%" height="3rem"
            style="margin-top: 10px; margin-right: 17px; border-radius: 0.357rem; background-color: #8080802b; float: right;" />
            </div>
        </div>
        <Skeleton v-if="this.daftarUsers == null" width="calc(100% - 30px)" height="20rem"
            style="margin-top: 10px; margin-left: 17px; border-radius: 0.357rem; background-color: #8080802b;" />
        <Toolbar v-if="this.daftarUsers != null" class="mb-4 ccm-custom" style="border: none; padding-bottom: 0; padding-left: 0; padding-right: 0"> 
            <template #start>  
                <h3 style="color: grey; letter-spacing: 0.5px; text-transform: uppercase;">Daftar User</h3>
            </template>
            <template #end>
                <Button label="New" icon="pi pi-plus" class="p-button-success mr-2" @click="addNewUser" />
            </template>
        </Toolbar>
        <DataTable style="box-shadow: 0 4px 24px 0 rgb(34 41 47 / 10%);" v-if="this.daftarUsers !== null"
            stateStorage="session" stateKey="dt-state-users"
            :value="this.daftarUsers" v-model:filters="filters" filterDisplay="menu"
            :globalFilterFields="['username','name', 'email', 'nip']" :scrollable="true" stripedRows responsiveLayout="scroll"
            :rowHover="true" dataKey="id" :paginator="true"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
            :rowsPerPageOptions="[10,25,50]" :rows="10"
            class="p-datatable-sm p-m-2 animate__animated animate__fadeIn ccm-custom"
            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}">
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

            <Column field="name" header="Nama" style="width: 20%; flex-wrap: wrap"></Column>
            <Column field="username" header="Username" style="width: 20%; flex-wrap: wrap"></Column>
            <Column field="email" header="Email" style="width: 20%; flex-wrap: wrap"></Column>
            <Column field="nip" header="NIP" style="width: 20%; flex-wrap: wrap"></Column>
            <Column field="roles" header="Role" style="width: 20%; flex-wrap: wrap">
                <template #body="col">
                    <div v-for="data in col.data.roles " v-bind:key="data" style="margin-bottom: 10px;">
                        <Button :label="data.name" icon="pi pi-user-plus"
                            class="p-button-sm p-button-rounded p-mr-2 p-tipe-user" :class="'team-'+data.name.toLowerCase().split('_')[1]"/>                      
                    </div>                    
                </template>
            </Column>                        
            <Column header="Aksi" style="width: 5%; flex-wrap: wrap">
                <template #body="col">
                    <Button v-tooltip.top="'Edit Password'" icon="pi pi-key" @click="editPass(col)" class="p-button-raised p-button-warning p-mr-2 p-mb-2" />
                    <Button v-tooltip.top="'Edit User'" icon="pi pi-pencil" @click="editKeySelected(col)" class="p-button-raised p-mr-2 p-mb-2" />
                    <Button v-tooltip.top="'Delete User'" icon="pi pi-trash" @click="deleteSelectedKeyOption(col);this.deleteDialog=true"
                        class="p-button-raised p-button-danger p-mb-2" />
                </template>
            </Column>
        </DataTable> 
            

        <Dialog v-model:visible="userDialog" :style="{width: '450px'}" :header="dialogHeader" class="p-fluid" :closable="false">
            <div class="field">
                <label for="name">Nama <span style="color: red">*</span></label>
                <InputText id="name" type="text" v-model.trim="modelUser.name" :class="!modelUser.name ? 'p-invalid' : ''" />
                <small v-if="!modelUser.name" id="name-help" class="p-error">Nama harus terisi!</small>
            </div>
            <br>
            <div class="field">
                <label for="description">Username <span style="color: red">*</span></label><br>
                <InputText id="username" type="text" v-model.trim="modelUser.username" :class="!modelUser.username ? 'p-invalid' : ''" />
                <small v-if="!modelUser.username" id="username-help" class="p-error">Username harus terisi!</small>
            </div>
            <br>
            <div class="field">
                <label for="description">Email</label><br>
                <InputText id="email" type="text" v-model.trim="modelUser.email" />
            </div>
            <br>
            <div class="field">
                <label for="nip">NIP</label><br>
                <InputNumber id="nip" v-model="modelUser.nip" mode="decimal" :useGrouping="false" />
            </div>
            <br>
            <div class="field ">
                <label for="description">Role</label><br>
                <div class="p-d-flex ">
                    <div class="field-checkbox">
                        <Checkbox id="user" name="user" value="USER" v-model="modelUser.role" />
                        <label for="user" class="p-ml-2">User</label>
                    </div>
                    <div class="field-checkbox p-ml-4">
                        <Checkbox id="admin" name="admin" value="ADMIN" v-model="modelUser.role" />
                        <label for="admin" class="p-ml-2">Admin</label>
                    </div>
                    <div class="field-checkbox p-ml-4">
                        <Checkbox id="supervisor" name="supervisor" value="SUPERVISOR" v-model="modelUser.role" />
                        <label for="supervisor" class="p-ml-2">Supervisor</label>
                    </div>
                </div>
            </div>
            <br>

            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text"
                    @click="userDialog=false; this.resetmodelUser()" />
                <Button :loading="loadingButton" v-if="this.dialogHeader !== 'Edit User'" label="Save"
                    icon="pi pi-check" class="p-button" @click="submit();;" />
                <Button :loading="loadingButton" v-if="this.dialogHeader == 'Edit User'" label="Update"
                    icon="pi pi-check" class="p-button" @click="update();;" />
            </template>
        </Dialog>

        <Dialog v-model:visible="passwordDialog" style="width: 450px;" header="Edit Password" class="p-fluid" :closable="false"> 
            <div class="field">
                <label for="new_password">New Password <span style="color: red">*</span></label>
                <Password :feedback="false" v-model.trim="newPassword.password" toggleMask :class="!this.newPassword.password ? 'p-invalid': ''" />                
                <small v-if="!this.newPassword.password" class="p-error">Isian tidak boleh kosong!</small>
            </div>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text"
                    @click="passwordDialog=false; this.newPassword = null" />
                <Button :loading="loadingButton" label="Update Password"
                    icon="pi pi-check" class="p-button" @click="updatePassword();" />              
            </template>
        </Dialog>

        <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Hapus Data" class="p-fluid">
            <p>Apakah Anda yakin ingin menghapus user? Data user akan hilang selamanya.</p>
            <template #footer>
                <Button label="Cancel" icon="pi pi-times" class="p-button-text" @click="deleteDialog=false" />
                <Button :loading="loadingButton" label="Yes" icon="pi pi-check" class="p-button"
                    @click="deleteFinal()" />
            </template>
        </Dialog>

    </div>
</template>

<script scoped>
    import DataService from '../services/DataService'
    import Toolbar from 'primevue/toolbar';
    import Dialog from 'primevue/dialog'
    import InputText from 'primevue/inputtext';
    import Toast from 'primevue/toast';
    import Breadcrumb from 'primevue/breadcrumb';
    import Skeleton from 'primevue/skeleton';
    import InputNumber from 'primevue/inputnumber';
    import Tooltip from 'primevue/tooltip';
    import Password from 'primevue/password';
    import {
        FilterMatchMode        
    } from 'primevue/api';
    import Checkbox from 'primevue/checkbox';    
    export default {
        components: {
            Toolbar,
            Dialog,
            InputText,
            Checkbox,
            Toast,
            Breadcrumb,
            Skeleton,
            InputNumber,
            Tooltip,
            Password
        },
        data() {
            return {
                home: {
                    icon: 'pi pi-home',
                },
                items: [
                    {
                        label: 'Manajemen Kegiatan'
                    },                
                ],
                filters: {
                    'global': {
                        value: null,
                        matchMode: FilterMatchMode.CONTAINS
                    },
                }, 
                passwordDialog: false,
                newPassword: null,
                daftarUsers: null,
                userDialog: false,
                modelUser: {
                    name: null,
                    password: null,
                    username: null,
                    email: null,
                    nip: null,
                    role: null,
                },
                selectedId: null,
                selectedIndex: null,
                dialogHeader: null,

                // tablestyle                
                loadingButton: false,
                deleteDialog: false,
                //
            }
        },
        watch: {},
        created() {
            this.getAllUsers()
        },
        computed: {},
        methods: {
            async getAllUsers() {                
                try {
                    this.daftarUsers = null
                    const users = await DataService.getAllUsers()                     
                    this.daftarUsers = users.data.data  
                } catch (error) {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Error !!',
                        detail: 'Something went wrong!',
                        life: 2000
                    });
                    console.log(error)
                }            
            },
            addNewUser() {
                this.userDialog = true
                this.dialogHeader = 'Tambah User'
            },
            editPass(data) {
                this.selectedId = data.data.id
                this.newPassword = {
                    "username": data.data.username,
                    "password": null
                }
                this.passwordDialog = true
            },
            async updatePassword() {
                if(!this.newPassword.password) return
                try {
                    this.loadingButton = true
                    const result = await DataService.updatePasswordUser(this.selectedId, this.newPassword)
                    this.loadingButton = false
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Sukses !!',
                        detail: 'Berhasil memperbarui password user!',
                        life: 2000
                    });
                    this.passwordDialog = false
                    this.newPassword = null
                    this.selectedId = null
                } catch (error) {
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Error !!',
                        detail: 'Something went wrong!',
                        life: 2000
                    });
                    this.loadingButton = false
                    console.log(error)
                }

            },
            editKeySelected(data) {
                
                this.dialogHeader = 'Edit User'
                this.selectedId = data.data.id
                this.selectedIndex = data.index

                this.modelUser.name = data.data.name
                this.modelUser.username = data.data.username
                this.modelUser.email = data.data.email
                this.modelUser.nip = data.data.nip
                this.modelUser.role = []
                data.data.roles.forEach(element => {
                    if (element.name == 'ROLE_USER') {
                        this.modelUser.role.push('USER')
                    } else {
                        this.modelUser.role.push('ADMIN')
                    }
                });

                this.userDialog = true
            },
            async update() {
                this.loadingButton = true
                try {
                    const result = await DataService.updateUser(this.selectedId, this.modelUser)

                    if(result.data.meta.status == 'error') throw new Error(result.data.data.error_message)                    

                    this.$toast.add({
                        severity: 'success',
                        summary: 'Berhasil !',
                        detail: 'Data berhasil diupdate',
                        life: 2000
                    });

                    this.loadingButton = false
                    this.userDialog = false
                    this.resetmodelUser()
                    this.getAllUsers()
                } catch (error) {
                    this.loadingButton = false
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Error !!',
                        detail: error,
                        life: 2000
                    });
                    console.log(error)
                }               
                
            },
            resetmodelUser() {

                this.modelUser = {
                    name: null,
                    username: null,
                    password: null,
                    email: null,
                    nip: null,
                    photo: null,
                    role: null,
                }
                this.selectedId = null
                this.selectedIndex = null
            },
            async submit() {

                if(!this.modelUser.name || !this.modelUser.username) return                
                this.modelUser.password = 'admin'
                this.loadingButton = true

                try {
                    const result = await DataService.addNewUser(this.modelUser)
                    if(result.data.meta.status == 'error') throw new Error(result.data.meta.message)
                    this.userDialog = false
                    this.resetmodelUser()
                    this.loadingButton = false
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Sukses !!',
                        detail: 'Berhasil menyimpan data!',
                        life: 2000
                    });
                    this.getAllUsers()
                } catch (error) {
                    this.loadingButton = false
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Error !!',
                        detail: error,
                        life: 2000
                    });
                    console.log(error)
                }                            
            },
            async deleteSelectedKeyOption(data) {
                this.selectedId = data.data.id
            },
            async deleteFinal() {
                this.loadingButton = true
                try {
                    const result = await DataService.deleteUser(this.selectedId)
                    this.loadingButton = false
                    this.deleteDialog = false
                    this.selectedId = null
                    this.$toast.add({
                        severity: 'success',
                        summary: 'Sukses !!',
                        detail: 'Berhasil menghapus data!',
                        life: 2000
                    });
                    this.getAllUsers()
                } catch (error) {
                    this.loadingButton = false
                    this.$toast.add({
                        severity: 'error',
                        summary: 'Error !!',
                        detail: error,
                        life: 2000
                    });
                    console.log(error)
                }            
            }
        }
    }
</script>

<style scoped>       

    ::v-deep(tr td) {
        padding: 30px !important;        
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

    .p-tipe-user {
        margin: 0 auto;
        cursor: default;
    }

    .p-tipe-user:focus {
        box-shadow: none;
    }

    .ccm-custom {
        margin-left: 15px !important;
        width: calc(100% - 30px);
    }

    .team-user {
        background-color: #C8E6C9; 
        color: #256029;
        border-color: #256029; 
        font-weight: 700;
        font-size: 12px;
        letter-spacing: .3px;
    }
    .team-admin {
        background-color: #b3e5fc; 
        color: #23547b;
        border-color: #23547b; 
        font-weight: 700;
        font-size: 12px;
        letter-spacing: .3px;
    }

    .team-supervisor {
        background-color: #fcc9b3; 
        color: #7b2f23;
        border-color: #7b2f23; 
        font-weight: 700;
        font-size: 12px;
        letter-spacing: .3px;
    }
</style>