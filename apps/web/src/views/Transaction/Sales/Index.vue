<script setup>
import { ref, computed } from 'vue';
import SelectPegawai from '@/components/SelectPegawai.vue';
import SelectSiswa from '@/components/SelectSiswa.vue';

const products = ref([
    { id: 1, name: 'Nasi Goreng', price: 15000, stock: 10 },
    { id: 2, name: 'Mie Goreng', price: 12000, stock: 15 },
    { id: 3, name: 'Es Teh', price: 3000, stock: 20 },
    { id: 4, name: 'Es Jeruk', price: 5000, stock: 15 },
    { id: 5, name: 'Kopi Hitam', price: 4000, stock: 12 },
    { id: 6, name: 'Teh Manis', price: 3000, stock: 18 },
]);

const cart = ref([]);
const searchQuery = ref('');
const selectedPaymentMethod = ref(null);
const selectedCustomer = ref(null);
const customerType = ref(null);
const showProductDialog = ref(false);
const newProduct = ref({
    name: '',
    price: null,
    stock: 1
});

const filteredProducts = computed(() => {
    if (!searchQuery.value) return products.value;
    return products.value.filter(product => 
        product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    );
});

const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => total + (item.price * item.quantity), 0);
});

const addToCart = (product) => {
    const existingItem = cart.value.find(item => item.id === product.id);
    if (existingItem) {
        if (existingItem.quantity < product.stock) {
            existingItem.quantity++;
        }
    } else {
        cart.value.push({
            ...product,
            quantity: 1
        });
    }
};

const removeFromCart = (productId) => {
    const index = cart.value.findIndex(item => item.id === productId);
    if (index > -1) {
        cart.value.splice(index, 1);
    }
};

const updateQuantity = (productId, newQuantity) => {
    const item = cart.value.find(item => item.id === productId);
    if (item) {
        const product = products.value.find(p => p.id === productId);
        if (newQuantity <= product.stock) {
            item.quantity = newQuantity;
        }
    }
};

const clearCart = () => {
    cart.value = [];
    selectedCustomer.value = null;
    customerType.value = null;
    selectedPaymentMethod.value = null;
};

const addNewProduct = () => {
    if (!newProduct.value.name || !newProduct.value.price) {
        alert('Mohon lengkapi data produk');
        return;
    }

    const newId = Math.max(...products.value.map(p => p.id), 0) + 1;
    const newProductData = {
        id: newId,
        ...newProduct.value
    };

    // Add to products list
    products.value.push(newProductData);
    
    // Add directly to cart
    cart.value.push({
        ...newProductData,
        quantity: 1
    });

    // Reset form and close dialog
    showProductDialog.value = false;
    newProduct.value = {
        name: '',
        price: null,
        stock: 1
    };
};

const processTransaction = () => {
    if (!selectedCustomer.value || !selectedPaymentMethod.value) {
        alert('Mohon lengkapi data pelanggan dan metode pembayaran');
        return;
    }
    
    console.log('Processing transaction:', {
        customer: selectedCustomer.value,
        items: cart.value,
        total: cartTotal.value,
        paymentMethod: selectedPaymentMethod.value
    });
    
    clearCart();
};
</script>

<template>
    <div class="grid">
        <div class="col-12 md:col-8">
            <Card>
                <template #title>
                    <div class="flex justify-content-between align-items-center">
                        <span>Penjualan</span>
                        <div class="flex gap-2">
                            <Button 
                                icon="pi pi-plus" 
                                severity="success" 
                                @click="showProductDialog = true"
                            >
                                Tambah Produk
                            </Button>
                            <Calendar showIcon />
                        </div>
                    </div>
                </template>
                <template #content>
                    <div class="grid">
                        <div class="col-12 mb-4">
                            <span class="p-input-icon-left w-full">
                                <i class="pi pi-search" />
                                <InputText v-model="searchQuery" placeholder="Cari produk..." class="w-full" />
                            </span>
                        </div>

                        <div class="col-12">
                            <div class="grid">
                                <div v-for="product in filteredProducts" :key="product.id" class="col-12 sm:col-6 lg:col-4">
                                    <Card class="h-full">
                                        <template #content>
                                            <div class="flex flex-column gap-2">
                                                <h3 class="m-0">{{ product.name }}</h3>
                                                <p class="text-xl font-bold m-0">Rp {{ product.price.toLocaleString('id-ID') }}</p>
                                                <p class="text-sm text-500 m-0">Stok: {{ product.stock }}</p>
                                                <Button 
                                                    @click="addToCart(product)"
                                                    :disabled="product.stock === 0"
                                                    class="w-full"
                                                    severity="success"
                                                >
                                                    <i class="pi pi-shopping-cart mr-2"></i>
                                                    Tambah ke Keranjang
                                                </Button>
                                            </div>
                                        </template>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>

        <div class="col-12 md:col-4">
    <Card>
        <template #title>
                    <div class="flex justify-content-between align-items-center">
                        <span>Keranjang</span>
                        <Badge :value="cart.length" severity="info" />
                    </div>
        </template>
        <template #content>
                    <div class="flex flex-column gap-4">
                        <div v-if="cart.length === 0" class="text-center text-500">
                            <i class="pi pi-shopping-cart text-4xl mb-2"></i>
                            <p>Keranjang belanja kosong</p>
                        </div>
                        <div v-else class="flex flex-column gap-3">
                            <div v-for="item in cart" :key="item.id" class="flex justify-content-between align-items-center p-2 border-1 border-round">
                                <div class="flex flex-column">
                                    <span class="font-bold">{{ item.name }}</span>
                                    <span class="text-sm">Rp {{ item.price.toLocaleString('id-ID') }}</span>
                                </div>
                                <div class="flex align-items-center gap-2">
                                    <InputNumber 
                                        v-model="item.quantity" 
                                        :min="1" 
                                        :max="products.find(p => p.id === item.id).stock"
                                        @update:modelValue="(val) => updateQuantity(item.id, val)"
                                        class="w-6rem"
                                    />
                                    <Button 
                                        icon="pi pi-trash" 
                                        severity="danger" 
                                        text 
                                        @click="removeFromCart(item.id)"
                                    />
                                </div>
                            </div>
                        </div>

                        <div class="flex flex-column gap-2">
                            <span class="font-bold">Data Pelanggan</span>
                            <div class="flex gap-2 mb-2">
                                <Button 
                                    v-for="type in ['Pegawai', 'Siswa']" 
                                    :key="type"
                                    :outlined="customerType !== type"
                                    :severity="customerType === type ? 'success' : 'secondary'"
                                    @click="customerType = type; selectedCustomer = null"
                                >
                                    {{ type }}
                                </Button>
                            </div>
                            <SelectPegawai v-if="customerType === 'Pegawai'" v-model="selectedCustomer" />
                            <SelectSiswa v-if="customerType === 'Siswa'" v-model="selectedCustomer" />
                        </div>

                        <div class="flex flex-column gap-2">
                            <span class="font-bold">Metode Pembayaran</span>
                            <div class="flex gap-2">
                                <Button 
                                    v-for="method in ['Cash', 'QRIS', 'Debit']" 
                                    :key="method"
                                    :outlined="selectedPaymentMethod !== method"
                                    :severity="selectedPaymentMethod === method ? 'success' : 'secondary'"
                                    @click="selectedPaymentMethod = method"
                                >
                                    <i :class="'pi pi-' + (method === 'Cash' ? 'money-bill' : method === 'QRIS' ? 'qrcode' : 'credit-card') + ' mr-2'"></i>
                                    {{ method }}
                                </Button>
                            </div>
                        </div>

                        <div class="flex flex-column gap-2">
                            <div class="flex justify-content-between align-items-center">
                                <span class="font-bold">Total:</span>
                                <span class="text-xl font-bold">Rp {{ cartTotal.toLocaleString('id-ID') }}</span>
                            </div>
                            <div class="flex gap-2">
                                <Button 
                                    label="Bersihkan" 
                                    severity="secondary" 
                                    class="flex-1"
                                    @click="clearCart"
                                >
                                    <i class="pi pi-trash mr-2"></i>
                                    Bersihkan
                                </Button>
                                <Button 
                                    label="Proses" 
                                    severity="success" 
                                    class="flex-1"
                                    @click="processTransaction"
                                    :disabled="cart.length === 0"
                                >
                                    <i class="pi pi-check mr-2"></i>
                                    Proses
                                </Button>
                            </div>
                        </div>
                    </div>
                </template>
            </Card>
        </div>
    </div>

    <!-- Dialog Tambah Produk -->
    <Dialog v-model:visible="showProductDialog" header="Tambah Produk Baru" :modal="true" class="w-6">
        <div class="flex flex-column gap-3">
            <div class="flex flex-column gap-2">
                <label for="name">Nama Produk</label>
                <InputText id="name" v-model="newProduct.name" class="w-full" />
            </div>
            <div class="flex flex-column gap-2">
                <label for="price">Harga</label>
                <InputNumber id="price" v-model="newProduct.price" :min="0" class="w-full" />
            </div>
            <div class="flex flex-column gap-2">
                <label for="stock">Stok</label>
                <InputNumber id="stock" v-model="newProduct.stock" :min="1" class="w-full" />
            </div>
        </div>
        <template #footer>
            <div class="flex justify-content-end gap-2">
                <Button label="Batal" icon="pi pi-times" @click="showProductDialog = false" text />
                <Button label="Simpan" icon="pi pi-check" @click="addNewProduct" severity="success" />
            </div>
        </template>
    </Dialog>
</template>

<style scoped>
.p-card {
    height: 100%;
}

.p-inputnumber {
    width: 6rem;
}

:deep(.p-card-header) {
    padding: 0.5rem 1rem;
    background-color: var(--surface-section);
    border-bottom: 1px solid var(--surface-border);
}

:deep(.p-card-content) {
    padding: 1rem;
}

:deep(.p-button.p-button-text) {
    padding: 0.5rem;
}

:deep(.p-inputtext) {
    width: 100%;
}
</style>