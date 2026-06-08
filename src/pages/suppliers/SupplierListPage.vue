<template>
    <div>
        <div class="flex items-center justify-between mb-6">
            <div>
                <h1 class="heading">Suppliers</h1>
                <p class="subheading mt-1">Manage your supply chain</p>
            </div>
            <button @click="openCreate" class="btn-primary">
                <svg class="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                New Supplier
            </button>
        </div>

        <DataTable :columns="columns" :data="supplierStore.suppliers as unknown as Record<string, unknown>[]">
            <template #cell-address="{ row }">
                <span class="text-dark-400">{{ row.address || '—' }}</span>
            </template>
            <template #actions="{ row }">
                <button @click="openEdit(row)"
                    class="text-lz-400 hover:text-lz-300 text-sm mr-3 font-medium">Edit</button>
                <button @click="confirmDelete(row.id as string)"
                    class="text-red-400 hover:text-red-300 text-sm font-medium">Delete</button>
            </template>
        </DataTable>

        <Modal v-model="showModal" :title="editing ? 'Edit Supplier' : 'New Supplier'">
            <form @submit.prevent="handleSubmit" class="space-y-4">
                <FormField name="companyName" label="Company Name" v-model="form.companyName"
                    :error="errors.companyName" />
                <FormField name="contactName" label="Contact Name" v-model="form.contactName"
                    :error="errors.contactName" />
                <FormField name="email" label="Email" type="email" v-model="form.email" :error="errors.email" />
                <FormField name="phone" label="Phone" v-model="form.phone" :error="errors.phone" />
                <FormField name="address" label="Address" type="textarea" v-model="form.address" />
                <div class="flex justify-end gap-3">
                    <button type="button" @click="showModal = false" class="btn-secondary">Cancel</button>
                    <button type="submit" :disabled="saving" class="btn-primary">{{ saving ? 'Saving...' : 'Save'
                        }}</button>
                </div>
            </form>
            <p v-if="apiError" class="text-sm text-red-400 mt-3 text-center">{{ apiError }}</p>
        </Modal>

        <Modal v-model="showDeleteModal" title="Delete Supplier">
            <p class="text-dark-400">Are you sure you want to delete this supplier?</p>
            <template #actions>
                <button @click="showDeleteModal = false" class="btn-secondary">Cancel</button>
                <button @click="deleteSupplier" class="btn-danger">Delete</button>
            </template>
        </Modal>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { useSupplierStore } from '../../stores/supplier.store';
import DataTable from '../../components/ui/DataTable.vue';
import Modal from '../../components/ui/Modal.vue';
import FormField from '../../components/ui/FormField.vue';
import type { Supplier } from '../../types';

const supplierStore = useSupplierStore();
const showModal = ref(false);
const showDeleteModal = ref(false);
const editing = ref<Supplier | null>(null);
const saving = ref(false);
const apiError = ref('');
const deleteTarget = ref('');
const form = reactive({ companyName: '', contactName: '', email: '', phone: '', address: '' });
const errors = reactive({ companyName: '', contactName: '', email: '', phone: '', address: '' });
const columns = [
    { key: 'companyName', label: 'Company' }, { key: 'contactName', label: 'Contact' },
    { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' },
];

function openCreate() { editing.value = null; form.companyName = ''; form.contactName = ''; form.email = ''; form.phone = ''; form.address = ''; showModal.value = true; }
function openEdit(supplier: unknown) {
    const s = supplier as Supplier; editing.value = s;
    form.companyName = s.companyName; form.contactName = s.contactName; form.email = s.email; form.phone = s.phone; form.address = s.address || ''; showModal.value = true;
}
async function handleSubmit() {
    apiError.value = ''; Object.keys(errors).forEach((k) => (errors[k as keyof typeof errors] = ''));
    let hasError = false;
    if (!form.companyName) { errors.companyName = 'Required'; hasError = true; }
    if (!form.contactName) { errors.contactName = 'Required'; hasError = true; }
    if (!form.email) { errors.email = 'Required'; hasError = true; }
    if (!form.phone) { errors.phone = 'Required'; hasError = true; }
    if (hasError) return;
    saving.value = true;
    try {
        const payload = { ...form, address: form.address || null };
        if (editing.value) { await supplierStore.update(editing.value.id, payload); }
        else { await supplierStore.create(payload); }
        showModal.value = false;
    } catch (err: unknown) { const error = err as { response?: { data?: { error?: string } } }; apiError.value = error?.response?.data?.error || 'Save failed'; }
    finally { saving.value = false; }
}
function confirmDelete(id: string) { deleteTarget.value = id; showDeleteModal.value = true; }
async function deleteSupplier() { await supplierStore.remove(deleteTarget.value); showDeleteModal.value = false; }
onMounted(() => supplierStore.fetchAll());
</script>
