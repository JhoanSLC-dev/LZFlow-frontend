<template>
    <div>
        <div class="mb-6">
            <h1 class="heading">{{ t('sales.new') }}</h1>
            <p class="subheading mt-1">{{ t('header.newTransaction') }}</p>
        </div>
        <div class="card max-w-3xl">
            <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
                <FormField name="customerName" :label="t('sales.customerName')" v-model="form.customerName"
                    :error="errors.customerName" :placeholder="t('sales.customerPlaceholder')" />

                <div>
                    <label class="label">{{ t('sales.products') }}</label>
                    <div v-for="(item, index) in form.items" :key="index"
                        class="flex items-center gap-3 mb-3 p-3 bg-dark-750/50 rounded-xl border border-dark-600/50">
                        <select v-model="item.productId" class="input flex-1" @change="selectProduct(index)">
                            <option value="">{{ t('sales.selectProduct') }}</option>
                            <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }} (Stock: {{
                                p.stockQuantity }}) - ${{ p.salePrice }}</option>
                        </select>
                        <input type="number" v-model.number="item.quantity" class="input w-24" :placeholder="t('sales.qtyCol')"
                            min="1" />
                        <input type="number" v-model.number="item.unitPrice" class="input w-28" :placeholder="t('sales.unitPriceCol')"
                            step="0.01" />
                        <p class="text-sm font-medium text-dark-200 w-24 text-right">${{ (item.quantity *
                            item.unitPrice).toFixed(2) }}</p>
                        <button type="button" @click="removeItem(index)"
                            class="text-red-400 hover:text-red-300 p-1">&times;</button>
                    </div>
                    <button type="button" @click="addItem" class="text-sm text-lz-400 hover:text-lz-300 font-medium">+
                        {{ t('sales.addItem') }}</button>
                    <p v-if="errors.items" class="text-sm text-red-400 mt-1">{{ errors.items }}</p>
                </div>

                <div class="flex items-center justify-between p-4 bg-dark-750/50 rounded-xl border border-dark-600/50">
                    <div class="space-y-2">
                        <p class="text-sm text-dark-400">{{ t('sales.subtotal') }} <span class="font-medium text-dark-200">${{
                                subtotal.toFixed(2) }}</span></p>
                        <FormField name="tax" :label="t('sales.tax')" type="number" v-model.number="form.tax" class="w-32" />
                    </div>
                    <p class="text-xl font-bold text-dark-50">${{ total.toFixed(2) }}</p>
                </div>

                <div class="flex items-center gap-3 pt-4">
                    <button type="submit" :disabled="submitting" class="btn-primary">
                        <svg v-if="submitting" class="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {{ submitting ? t('sales.creating') : t('sales.completeSale') }}
                    </button>
                    <router-link to="/sales" class="btn-secondary">{{ t('common.cancel') }}</router-link>
                </div>
                <p v-if="apiError" class="text-sm text-red-400 bg-red-500/10 rounded-lg p-3 border border-red-500/20">{{
                    apiError }}</p>
            </form>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useSaleStore } from '../../stores/sale.store';
import { useProductStore } from '../../stores/product.store';
import { useLocaleStore } from '../../stores/locale.store';
import FormField from '../../components/ui/FormField.vue';

const { t } = useLocaleStore();

const router = useRouter();
const saleStore = useSaleStore();
const productStore = useProductStore();
const products = productStore.products;
const submitting = ref(false);
const apiError = ref('');
const form = reactive({ customerName: '', tax: 0, items: [{ productId: '', quantity: 1, unitPrice: 0 }] });
const errors = reactive({ customerName: '', items: '' });
const subtotal = computed(() => form.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0));
const total = computed(() => subtotal.value + form.tax);

function addItem() { form.items.push({ productId: '', quantity: 1, unitPrice: 0 }); }
function removeItem(index: number) { form.items.splice(index, 1); }
function selectProduct(index: number) {
    const product = products.find((p) => p.id === form.items[index].productId);
    if (product) form.items[index].unitPrice = Number(product.salePrice);
}

async function handleSubmit() {
    apiError.value = ''; errors.customerName = ''; errors.items = '';
    let hasError = false;
    if (!form.customerName) { errors.customerName = t('sales.validationRequired'); hasError = true; }
    if (form.items.length === 0 || form.items.some((i) => !i.productId || i.quantity <= 0)) { errors.items = t('sales.validationItems'); hasError = true; }
    if (hasError) return;
    submitting.value = true;
    try {
        await saleStore.create({ customerName: form.customerName, tax: form.tax, items: form.items.map((i) => ({ productId: i.productId, quantity: i.quantity, unitPrice: i.unitPrice })) });
        router.push('/sales');
    } catch (err: unknown) {
        const error = err as { response?: { data?: { error?: string } } };
        apiError.value = error?.response?.data?.error || t('sales.saleFailed');
    } finally { submitting.value = false; }
}
onMounted(() => productStore.fetchAll({ limit: 100 }));
</script>
