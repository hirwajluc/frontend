<template>
  <div class=" p-4 rounded-lg border border-border">
    <div class="font-bold text-green-700 text-xl pb-4">CODE OVERVIEW</div>
    <div :class="authStore.user.can_add_codes ? `grid-cols-4 ` :`grid-cols-3`" class="  lg:grid items-center gap-x-4 max-sm:space-y-2">
      <DashboardCodeCard title="TOTAL CODES" :amount="formatWithSeparator(codeOverview.totalCode)" />
      <DashboardCodeCard title="USED CODES" :amount="formatWithSeparator(codeOverview.usedCode)" />
      <DashboardCodeCard title="REMAINING CODES" :amount="formatWithSeparator(codeOverview.remainCode)" />
      <div v-if="authStore.user.can_add_codes" class="flex flex-col gap-2 border p-2 rounded-lg border-border">
        <div class="font-semibold text-green-700">New Code</div>
        <div class="font-light text-xs text-gray-500">Upload an Excel file with one column of codes in Sheet1, starting from the second row (header row required).</div>
        <div class="flex gap-4">
          <Button type="button" icon="pi pi-file-arrow-up" label="Upload Codes"
            @click="mainStore.setUploadModal(true)" />
        </div>
      </div>

    </div>
    <Dialog v-model:visible="uploadModal" :closable="false" modal header="Upload Codes" @update:visible="handleUploadDialogClose"
      :style="{ width: '30vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <div class="m-0">
        <p class="m-0 mb-4">
          Please upload either an Excel file (Sheet1, with a header row and codes beginning in the second row) or a text file (.txt) containing codes, with each code on a separate line.<br /><br />
          Upload or drag-and-drop your Excel files (.xlsx, .xls, .txt) here.
        </p>
        <!-- Show loading spinner when files are uploading -->

        <!-- Drag and Drop area with click upload -->
        <div class="file-drop-area" @drop.prevent="onDrop" @dragover.prevent>
          <i class="pi pi-cloud-upload text-5xl"></i>
          <p class="m-0">Click to upload or drag and drop</p>
          <small>Maximum file size: 100 MB</small>

          <!-- Hidden file input to handle file selection -->
          <input type="file" class="file-input" ref="fileInput" @change="onFileSelect" accept=".csv,.xls,.xlsx,.txt" />
        </div>
        <!-- Uploaded files with progress bar -->
        <div v-if="uploadedFiles.length" class="uploaded-file-list gap-y-2 mt-4">

          <div v-for="(file, index) in uploadedFiles" :key="index"
            class=" border border-border rounded-lg mb-2 py-2 px-2   space-y-2 flex-col">
            <div class="flex w-full justify-between">
              <div class="file-info">
                <div class="flex gap-x-4 items-center">
                  <div class="file-icon">
                    <i class="pi pi-file-excel text-3xl"></i>
                  </div>
                  <div>
                    <div class="file-name text-xs text-primary font-semibold">
                      {{ file.name }}
                    </div>
                    <div class="file-size text-sm text-orange-500 font-semibold">
                      Size: {{ formatSize(file.size) }}
                    </div>
                    <ProgressBar class="w-64" :mode="loading?'indeterminate':'determinate'" style="height: 6px" />
                  </div>
                </div>
                <Button icon="pi pi-times" class="p-button-text p-button-danger  ml-auto" @click="removeFile(index)" />
              </div>

            </div>


          </div>

        </div>
      </div>
      <div class="flex justify-end gap-2 mt-4">
        <Button type="button" label="Cancel" severity="danger" @click="cancelFileUpload()"></Button>
        <Button type="button" label="Save Code" icon="pi pi-save" :loading="loading" @click="codeStore.uploadCodes(file)"></Button>
      </div>
    </Dialog>

    <Dialog v-model:visible="deleteModal" modal header="Delete" @update:visible="handleDeleteDialogClose"
      :style="{ width: '25vw' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
      <p class="m-0">
        Are you sure you want to delete this record?
      </p>
      <div class="flex justify-end gap-2 mt-4">
        <Button type="button" label="Cancel" severity="danger" text @click="mainStore.setUploadModal(false)"></Button>
        <Button type="button" label="Delete" severity="danger" icon="pi pi-trash"
          @click="mainStore.setUploadModal(false)"></Button>
      </div>
    </Dialog>

  </div>
</template>

<script lang="ts" setup>
import { useThousandSeparator } from '@/composables/useThousandSeparator'

const { formatWithSeparator } = useThousandSeparator()

const mainStore = useMainStore()
const authStore = useAuthStore();

const codeStore = useCodesStore()
const uploadModal = computed(() => {
  return mainStore.uploadModal
})
const deleteModal = computed(() => {
  return mainStore.deleteModal
})

function handleUploadDialogClose(visible: any) {
  if (!visible) {

  }
}

function handleDeleteDialogClose(visible: any) {
  if (!visible) {
    mainStore.setDeleteModal(false);
  }
}
const fileInput = ref(null); // Reference to the file input element
const file = ref(null)
const uploadedFiles = ref<File[]>([]);
const loading = computed(() => codeStore.loading);
const codeOverview = computed(() => codeStore.codeOverview);
onMounted(() => {
  codeStore.getAllCodeOverview();
})

// Format file size in KB or MB
function formatSize(size: any) {
  return size < 1024 * 1024
    ? (size / 1024).toFixed(2) + ' KB'
    : (size / (1024 * 1024)).toFixed(2) + ' MB';
}

// Handle file selection
function onFileSelect(event: any) {
  const files = event.target.files || event.dataTransfer.files;
  uploadFile(files[0]);
}

// Drag and drop handler
function onDrop(event: any) {
  const files = event.dataTransfer.files;
  for (const file of files) {
    uploadFile(file);
  }
}
const alert = useAlertStore()
// Simulate the file upload and track progress
function uploadFile(files: any) {
  if(uploadedFiles.value.length > 0){
    alert.error("You can only upload one file at a time.");
    return;
  }
  uploadedFiles.value.push(files);

  if (files.size > 100000000) {
    alert.error("please check file size no over 100 MB.");
    return;
  }
  file.value = files;
}

function cancelFileUpload() {
  uploadedFiles.value = [];
  file.value = null;
  mainStore.setUploadModal(false)
}
// Handle file removal
function removeFile(index: any) {
  uploadedFiles.value.splice(index, 1);
  file.value = null;
}
</script>
<style scoped>
.file-drop-area {
  border: 2px dashed #a3a3a3;
  padding: 40px;
  text-align: center;
  cursor: pointer;

  position: relative;
  background-color: #f8f8f8;
  border-radius: 8px;
}



.uploaded-file-list ul {
  list-style-type: none;
  padding-left: 0;
}

.uploaded-file-item {
  display: flex;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #ccc;
}

.file-info {
  flex: 1;
  display: flex;
  align-items: center;
}

.file-progress {
  width: 100%;
  margin-left: 10px;
}

.file-drop-area {
  position: relative;
  width: 100%;
  height: 200px;
  border: 2px dashed #ccc;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.file-drop-area:hover {
  border-color: #666;
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
}

.choose-file-button:hover {
  background-color: #0056b3;
}
</style>