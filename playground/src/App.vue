<script setup lang="ts">
  import { Modal, PrimaryButton, createTypedModal, type ModalClasses } from 'noirium/ui';
  import { ref, useTemplateRef } from 'vue';

  import BrandedHeroLayout from './modal-layouts/BrandedHeroLayout.vue';
  import ConfirmLayout from './modal-layouts/ConfirmLayout.vue';
  import DrawerLayout from './modal-layouts/DrawerLayout.vue';

  // One-liner: ConfirmModal now has full autocomplete for `tone`,
  // `confirmLabel`, `cancelLabel`, `@confirm`, `@cancel` — alongside
  // every Modal shell prop (`visible`, `closable`, `closeOnEscape`, …).
  const ConfirmModal = createTypedModal(ConfirmLayout);

  // ---- Built-in layouts -----------------------------------------------------
  const defaultModalRef = useTemplateRef('defaultModal');
  const fullscreenOpen = ref(false);
  const bottomSheetOpen = ref(false);
  const persistentOpen = ref(false);
  const persistentTriedToClose = ref(0);
  const themedOpen = ref(false);
  const stackedOuter = ref(false);
  const stackedInner = ref(false);

  const themedClasses: ModalClasses = {
    backdrop: 'bg-black/60 backdrop-blur-md',
    body: 'bg-gradient-to-br from-neutral-100 to-white border-2 border-neutral-200',
    header: 'bg-neutral-100/60',
  };

  // ---- Custom layouts -------------------------------------------------------
  const heroOpen = ref(false);
  const drawerOpen = ref(false);
  const confirmOpen = ref(false);
  const lastConfirmAction = ref<string>('');
</script>

<template>
  <div class="min-h-screen bg-neutral-50 px-6 py-10">
    <div class="mx-auto max-w-3xl">
      <h1 class="mb-2 text-3xl font-bold text-neutral-950">Modal Playground</h1>
      <p class="mb-8 text-neutral-600">
        Live samples of every Modal layout — built-in and fully custom.
      </p>

      <!-- Built-in layouts -->
      <section class="mb-10">
        <h2 class="mb-3 text-xl font-semibold text-neutral-800">Built-in layouts</h2>
        <div class="flex flex-wrap gap-3">
          <PrimaryButton @click="defaultModalRef?.open()"> Default (with footer) </PrimaryButton>
          <PrimaryButton @click="fullscreenOpen = true">Fullscreen</PrimaryButton>
          <PrimaryButton @click="bottomSheetOpen = true"> Responsive bottom sheet </PrimaryButton>
          <PrimaryButton @click="persistentOpen = true"> Persistent (not closable) </PrimaryButton>
          <PrimaryButton @click="themedOpen = true">Themed (custom classes)</PrimaryButton>
          <PrimaryButton @click="stackedOuter = true">Stacked modals</PrimaryButton>
        </div>
      </section>

      <!-- Custom layouts -->
      <section>
        <h2 class="mb-3 text-xl font-semibold text-neutral-800">Custom layouts</h2>
        <p class="mb-3 text-sm text-neutral-500">
          Pass any component as <code>:layout</code> and use <code>useModalContext()</code> inside
          it.
        </p>
        <div class="flex flex-wrap gap-3">
          <PrimaryButton @click="heroOpen = true">Branded hero</PrimaryButton>
          <PrimaryButton @click="drawerOpen = true">Right drawer</PrimaryButton>
          <PrimaryButton @click="confirmOpen = true">Confirm dialog (danger)</PrimaryButton>
        </div>
        <p
          v-if="lastConfirmAction"
          class="mt-3 text-sm text-neutral-600"
        >
          Last confirm action: <strong>{{ lastConfirmAction }}</strong>
        </p>
      </section>
    </div>

    <!-- ===== Built-in layouts ===== -->

    <Modal
      ref="defaultModal"
      title="Confirm action"
    >
      <p class="m-0">Are you sure you want to proceed?</p>
      <template #footer>
        <div class="flex justify-end gap-2">
          <PrimaryButton
            variant="outline"
            @click="defaultModalRef?.close()"
          >
            Cancel
          </PrimaryButton>
          <PrimaryButton
            variant="primary"
            @click="defaultModalRef?.close()"
          >
            Confirm
          </PrimaryButton>
        </div>
      </template>
    </Modal>

    <Modal
      v-model:visible="fullscreenOpen"
      layout="fullscreen"
      title="Fullscreen Modal"
    >
      <p>Edge-to-edge layout for immersive content like onboarding flows.</p>
    </Modal>

    <Modal
      v-model:visible="bottomSheetOpen"
      title="Adaptive Modal"
      :modal-only="false"
    >
      <p>
        Resize below 768px — this slides up from the bottom as a mobile-friendly sheet. Above the
        breakpoint it renders as a centered modal.
      </p>
    </Modal>

    <Modal
      v-model:visible="persistentOpen"
      title="Persistent"
      :closable="false"
      @tried-close="persistentTriedToClose += 1"
    >
      <p>Backdrop click and Escape are intercepted — the parent is notified instead of closing.</p>
      <p class="text-sm text-slate-500">Tried to close: {{ persistentTriedToClose }} time(s)</p>
      <PrimaryButton
        class="mt-4"
        @click="persistentOpen = false"
      >
        Close programmatically
      </PrimaryButton>
    </Modal>

    <Modal
      v-model:visible="themedOpen"
      title="Themed"
      :classes="themedClasses"
    >
      <p>
        Every zone — backdrop, wrapper, body, header, content, footer, close button — accepts class
        overrides via the <code>classes</code> prop.
      </p>
    </Modal>

    <Modal
      v-model:visible="stackedOuter"
      title="Outer Modal"
    >
      <p>Open another modal on top.</p>
      <template #footer>
        <PrimaryButton @click="stackedInner = true">Open inner</PrimaryButton>
      </template>
    </Modal>
    <Modal
      v-model:visible="stackedInner"
      title="Inner Modal"
    >
      <p>Escape only closes the topmost modal. Body scroll lock is ref-counted.</p>
    </Modal>

    <!-- ===== Custom layouts ===== -->

    <Modal
      v-model:visible="heroOpen"
      title="Welcome aboard"
      :layout="BrandedHeroLayout"
    >
      A custom layout receives the modal context and renders whatever it wants — no structural
      assumptions from the shell.
    </Modal>

    <Modal
      v-model:visible="drawerOpen"
      title="Settings"
      :layout="DrawerLayout"
    >
      <div class="space-y-4">
        <div>
          <label class="text-sm font-medium text-slate-700">Display name</label>
          <input
            type="text"
            class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-slate-700">Email</label>
          <input
            type="email"
            class="mt-1 w-full rounded-md border border-slate-300 px-3 py-2"
            placeholder="jane@example.com"
          />
        </div>
        <p class="text-xs text-slate-500">
          The drawer is just a custom layout — slides in from the right, click outside to dismiss.
        </p>
      </div>
    </Modal>

    <ConfirmModal
      v-model:visible="confirmOpen"
      title="Delete this project?"
      tone="danger"
      confirm-label="Delete"
      cancel-label="Keep it"
      @confirm="lastConfirmAction = 'Deleted'"
      @cancel="lastConfirmAction = 'Cancelled'"
    >
      This action cannot be undone. All associated data will be permanently removed from our
      servers.
    </ConfirmModal>
  </div>
</template>
