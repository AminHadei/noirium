<script setup lang="ts">
  import {
    Accordion,
    AccordionContent,
    AccordionHeader,
    AccordionItem,
    Alert,
    AlertDescription,
    AlertTitle,
    AreaChart,
    Avatar,
    Badge,
    BarChart,
    BaseBadge,
    BaseDialog,
    BaseDropdown,
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
    Button,
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    Calendar,
    Checkbox,
    CheckInput,
    Command,
    CommandDialog,
    CommandDisplay,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandShortcut,
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuTrigger,
    Countdown,
    CountryDropdown,
    createToastHelpers,
    createTypedModal,
    DateInput,
    DatePicker,
    Dialog,
    DialogBody,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyIcon,
    EmptyTitle,
    Field,
    FieldDescription,
    FieldError,
    FieldLabel,
    IconButton,
    Input,
    InputNumber,
    Label,
    LineChart,
    Loader,
    Menu,
    MenuContent,
    MenuItem,
    MenuTrigger,
    Modal,
    PhoneNumberInput,
    PieChart,
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
    PrimaryButton,
    Progress,
    RadioGroup,
    RadioGroupItem,
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
    Slider,
    Switch,
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableOfContents,
    TableRow,
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
    Text,
    Textarea,
    Toggle,
    ToggleGroup,
    ToggleGroupItem,
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
    useToast,
    type ModalClasses,
  } from 'noirium/ui';
  import type { Iso2 } from 'noirium/ui';
  import { ref, useTemplateRef } from 'vue';

  interface PlaygroundDropdownItem {
    id: string | number;
    label: string;
    disabled?: boolean;
  }

  import BrandedHeroLayout from './modal-layouts/BrandedHeroLayout.vue';
  import ConfirmLayout from './modal-layouts/ConfirmLayout.vue';
  import DrawerLayout from './modal-layouts/DrawerLayout.vue';

  const { playgroundTitle = 'Noirium UI — Playground' } = defineProps<{
    playgroundTitle?: string;
  }>();

  const ConfirmModal = createTypedModal(ConfirmLayout);

  const toast = useToast();
  const toastHelpers = createToastHelpers(toast);

  const clicks = ref(0);
  const progress = ref(60);
  const overlayDrawerOpen = ref(false);
  const fruit = ref('');
  const commandDialogOpen = ref(false);
  const inputValue = ref('');
  const textareaValue = ref('');
  const switched = ref(false);
  const sliderValue = ref(50);
  const radioValue = ref('a');
  const toggleOn = ref(false);
  const toggleGroup = ref<string[]>([]);
  const checked = ref(false);
  const checkInputChecked = ref(false);
  const baseDialogOpen = ref(false);
  const dialogOpen = ref(false);
  const datePickerValue = ref<Date | undefined>();
  const dateInputValue = ref<Date | null>(null);
  const calendarDate = ref<Date | undefined>(new Date());
  const inputNumberValue = ref<string | null>(null);
  const dropdownItem = ref<PlaygroundDropdownItem | null>(null);
  const countryCode = ref<Iso2 | null>('us');
  const phoneNumber = ref('');
  const countdownStart = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();

  const dropdownItems: PlaygroundDropdownItem[] = [
    { id: 1, label: 'Profile' },
    { id: 2, label: 'Settings' },
    { id: 3, label: 'Logout' },
  ];

  const tocItems = [
    { id: 'intro', title: 'Introduction', depth: 1 },
    { id: 'setup', title: 'Setup', depth: 2 },
    { id: 'usage', title: 'Usage', depth: 2 },
  ];

  const chartData = [
    { month: 'Jan', desktop: 186, mobile: 80 },
    { month: 'Feb', desktop: 305, mobile: 200 },
    { month: 'Mar', desktop: 237, mobile: 120 },
    { month: 'Apr', desktop: 73, mobile: 190 },
  ];

  const pieData = [
    { name: 'Chrome', value: 275 },
    { name: 'Safari', value: 200 },
    { name: 'Firefox', value: 187 },
  ];

  const notify = (): void => {
    toastHelpers.success({
      title: 'Event created',
      description: 'Your changes have been saved.',
    });
  };

  // ---- Modal playground -----------------------------------------------------
  const defaultModalRef = useTemplateRef('defaultModal');
  const fullscreenOpen = ref(false);
  const bottomSheetOpen = ref(false);
  const persistentOpen = ref(false);
  const persistentTriedToClose = ref(0);
  const themedOpen = ref(false);
  const stackedOuter = ref(false);
  const stackedInner = ref(false);
  const heroOpen = ref(false);
  const drawerOpen = ref(false);
  const confirmOpen = ref(false);
  const lastConfirmAction = ref('');

  const themedClasses: ModalClasses = {
    backdrop: 'bg-black/60 backdrop-blur-md',
    body: 'bg-gradient-to-br from-neutral-100 to-white border border-neutral-200',
    header: 'bg-neutral-100/60',
  };
</script>

<template>
  <div class="playground-shell">
    <main class="playground-main">
      <header class="playground-header">
        <h1>{{ playgroundTitle }}</h1>
        <p>Interactive samples of every parity component exported from <code>noirium/ui</code>.</p>
      </header>

      <section class="playground-section">
        <h2>Button &amp; PrimaryButton</h2>
        <h3 class="m-0 text-base font-semibold text-neutral-800">PrimaryButton</h3>
        <div class="playground-row">
          <PrimaryButton @click="clicks++">Primary</PrimaryButton>
          <PrimaryButton variant="outline">Outline</PrimaryButton>
          <PrimaryButton variant="text">Text</PrimaryButton>
          <PrimaryButton disabled>Disabled</PrimaryButton>
        </div>
        <h3 class="m-0 text-base font-semibold text-neutral-800">Button</h3>
        <div class="playground-row">
          <Button @click="clicks++">Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="link">Link</Button>
          <Button variant="ghost">Ghost</Button>
          <Button disabled>Disabled</Button>
        </div>
        <div class="playground-row">
          <Button size="sm">Small</Button>
          <Button size="md">Medium</Button>
          <Button size="lg">Large</Button>
        </div>
        <p class="playground-muted">Clicked {{ clicks }} times</p>
      </section>

      <section class="playground-section">
        <h2>Icon Button</h2>
        <div class="playground-row">
          <IconButton variant="primary"><span class=":uno: i-search size-5" /></IconButton>
          <IconButton variant="outline"><span class=":uno: i-search size-5" /></IconButton>
          <IconButton variant="text"><span class=":uno: i-search size-5" /></IconButton>
          <IconButton disabled><span class=":uno: i-search size-5" /></IconButton>
        </div>
      </section>

      <section class="playground-section">
        <h2>Typography</h2>
        <Text as="h3">A Noirium heading</Text>
        <Text as="p">Body copy rendered through the polymorphic Text component.</Text>
      </section>

      <section class="playground-section">
        <h2>Badge &amp; BaseBadge</h2>
        <h3 class="m-0 text-base font-semibold text-neutral-800">BaseBadge</h3>
        <div class="playground-row">
          <BaseBadge>Default</BaseBadge>
          <BaseBadge color="green">Success</BaseBadge>
          <BaseBadge color="red">Error</BaseBadge>
        </div>
        <h3 class="m-0 text-base font-semibold text-neutral-800">Badge</h3>
        <div class="playground-row">
          <Badge>Default</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="solid">Solid</Badge>
          <Badge variant="surface">Surface</Badge>
        </div>
      </section>

      <section class="playground-section">
        <h2>Card &amp; Avatar</h2>
        <div class="playground-row items-start">
          <Card class="max-w-xs">
            <CardHeader>
              <CardTitle>Card title</CardTitle>
              <CardDescription>A short description for the card.</CardDescription>
            </CardHeader>
            <CardContent>Any content can live inside the card body.</CardContent>
          </Card>
          <Avatar
            src="https://i.pravatar.cc/150?img=12"
            alt="Avatar"
            :width="64"
            :height="64"
          />
        </div>
      </section>

      <section class="playground-section">
        <h2>Progress &amp; Loader</h2>
        <div class="playground-stack">
          <Progress :value="progress" />
          <input
            v-model.number="progress"
            type="range"
            min="0"
            max="100"
          />
          <div class="flex items-center justify-between">
            <Loader size="sm" />
            <Loader size="md" />
            <Loader
              size="lg"
              variant="secondary"
            />
          </div>
        </div>
      </section>

      <section class="playground-section">
        <h2>Empty</h2>
        <Empty class="max-w-sm">
          <EmptyContent>
            <EmptyIcon />
            <EmptyTitle>No results found</EmptyTitle>
            <EmptyDescription>Try adjusting your filters or search terms.</EmptyDescription>
          </EmptyContent>
        </Empty>
      </section>

      <section class="playground-section">
        <h2>Alert</h2>
        <div class="playground-stack">
          <Alert status="info">
            <AlertTitle>Info</AlertTitle>
            <AlertDescription>An informational message.</AlertDescription>
          </Alert>
          <Alert status="error">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>Something went wrong.</AlertDescription>
          </Alert>
          <Alert status="success">
            <AlertTitle>Success</AlertTitle>
            <AlertDescription>Your changes were saved.</AlertDescription>
          </Alert>
          <Alert status="warning">
            <AlertTitle>Warning</AlertTitle>
            <AlertDescription>Please review before continuing.</AlertDescription>
          </Alert>
        </div>
      </section>

      <section class="playground-section">
        <h2>Overlays (Dialog &amp; BaseDialog)</h2>
        <div class="playground-row">
          <Dialog v-model:open="dialogOpen">
            <DialogTrigger>
              <PrimaryButton>Open dialog</PrimaryButton>
            </DialogTrigger>
            <DialogContent size="md">
              <DialogHeader>
                <DialogTitle>Edit profile</DialogTitle>
              </DialogHeader>
              <DialogBody>
                <DialogDescription>Make changes to your profile here.</DialogDescription>
              </DialogBody>
              <DialogFooter>
                <PrimaryButton
                  variant="outline"
                  @click="dialogOpen = false"
                >
                  Cancel
                </PrimaryButton>
                <PrimaryButton @click="dialogOpen = false">Save</PrimaryButton>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <PrimaryButton @click="baseDialogOpen = true">BaseDialog</PrimaryButton>
          <BaseDialog
            v-model:visible="baseDialogOpen"
            header="Base dialog"
            width="480px"
          >
            <p class="m-0">Legacy shared dialog shell — kept alongside Dialog.</p>
          </BaseDialog>

          <Drawer v-model:open="overlayDrawerOpen">
            <DrawerTrigger>
              <PrimaryButton variant="outline">Open drawer</PrimaryButton>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Drawer title</DrawerTitle>
                <DrawerDescription>A side panel that slides into view.</DrawerDescription>
              </DrawerHeader>
              <div class="flex-1 p-4">Drawer body content.</div>
              <DrawerFooter>
                <DrawerClose>
                  <PrimaryButton
                    variant="outline"
                    class="w-full"
                  >
                    Close
                  </PrimaryButton>
                </DrawerClose>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>

          <Popover>
            <PopoverTrigger>
              <PrimaryButton variant="outline">Popover</PrimaryButton>
            </PopoverTrigger>
            <PopoverContent>
              <PopoverHeader>
                <PopoverTitle>Dimensions</PopoverTitle>
                <PopoverDescription>Set the dimensions for the layer.</PopoverDescription>
              </PopoverHeader>
            </PopoverContent>
          </Popover>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <PrimaryButton variant="outline">Hover me</PrimaryButton>
              </TooltipTrigger>
              <TooltipContent>Add to library</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </section>

      <section class="playground-section">
        <h2>Breadcrumb</h2>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="#">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </section>

      <section class="playground-section">
        <h2>Accordion</h2>
        <Accordion
          type="single"
          collapsible
          class="max-w-md"
        >
          <AccordionItem value="item-1">
            <AccordionHeader>Is it accessible?</AccordionHeader>
            <AccordionContent>Yes. It follows the WAI-ARIA pattern.</AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionHeader>Is it styled?</AccordionHeader>
            <AccordionContent>Yes, with the Noirium theme tokens.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </section>

      <section class="playground-section">
        <h2>Tabs</h2>
        <Tabs
          default-value="account"
          class="max-w-md"
        >
          <TabsList>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>
          <TabsContent value="account">Manage your account here.</TabsContent>
          <TabsContent value="password">Change your password here.</TabsContent>
        </Tabs>
      </section>

      <section class="playground-section">
        <h2>Menu &amp; Context Menu</h2>
        <div class="playground-row">
          <Menu>
            <MenuTrigger>
              <PrimaryButton variant="outline">Open menu</PrimaryButton>
            </MenuTrigger>
            <MenuContent>
              <MenuItem>Profile</MenuItem>
              <MenuItem>Settings</MenuItem>
              <MenuItem>Logout</MenuItem>
            </MenuContent>
          </Menu>

          <ContextMenu>
            <ContextMenuTrigger>
              <div
                class="flex h-24 w-48 items-center justify-center rounded-lg border border-dashed border-neutral-300 text-sm text-neutral-600"
              >
                Right-click here
              </div>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <ContextMenuLabel>Actions</ContextMenuLabel>
              <ContextMenuSeparator />
              <ContextMenuItem>Copy</ContextMenuItem>
              <ContextMenuItem>Paste</ContextMenuItem>
            </ContextMenuContent>
          </ContextMenu>
        </div>
      </section>

      <section class="playground-section">
        <h2>Select</h2>
        <Select
          v-model="fruit"
          placeholder="Pick a fruit"
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruits</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="banana">Banana</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectItem value="carrot">Carrot</SelectItem>
          </SelectContent>
        </Select>
        <p class="playground-muted">Selected: {{ fruit || 'none' }}</p>
      </section>

      <section class="playground-section">
        <h2>Table</h2>
        <Table>
          <TableCaption>A list of recent invoices.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>INV001</TableCell>
              <TableCell>Paid</TableCell>
              <TableCell>$250.00</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>INV002</TableCell>
              <TableCell>Pending</TableCell>
              <TableCell>$150.00</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </section>

      <section class="playground-section">
        <h2>Command</h2>
        <Command class="max-w-md">
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Suggestions">
              <CommandItem value="calendar">Calendar</CommandItem>
              <CommandItem value="search-emoji">Search Emoji</CommandItem>
              <CommandItem value="calculator">Calculator</CommandItem>
            </CommandGroup>
            <CommandGroup heading="Settings">
              <CommandItem value="profile">
                Profile
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </section>

      <section class="playground-section">
        <h2>Command Display</h2>
        <div class="max-w-md">
          <CommandDisplay command="pnpm add noirium" />
        </div>
      </section>

      <section class="playground-section">
        <h2>Forms</h2>
        <div class="playground-stack">
          <div class="flex flex-col gap-2">
            <Label for="demo-input">Input</Label>
            <Input
              id="demo-input"
              v-model="inputValue"
              placeholder="Your name"
            />
          </div>
          <div class="flex flex-col gap-2">
            <Label for="demo-textarea">Textarea</Label>
            <Textarea
              id="demo-textarea"
              v-model="textareaValue"
              placeholder="Notes"
            />
          </div>
          <h3 class="m-0 text-base font-semibold text-neutral-800">Checkbox &amp; CheckInput</h3>
          <Checkbox v-model="checked">Accept terms (Checkbox)</Checkbox>
          <CheckInput v-model="checkInputChecked">Accept terms (CheckInput)</CheckInput>
          <div class="playground-row">
            <Switch v-model="switched" />
            <span class="text-sm text-neutral-700">Notifications</span>
          </div>
          <Slider v-model="sliderValue" />
          <RadioGroup v-model="radioValue">
            <label class="flex items-center gap-2">
              <RadioGroupItem value="a" />
              Option A
            </label>
            <label class="flex items-center gap-2">
              <RadioGroupItem value="b" />
              Option B
            </label>
          </RadioGroup>
          <Toggle v-model="toggleOn">Bold</Toggle>
          <ToggleGroup
            v-model="toggleGroup"
            type="multiple"
          >
            <ToggleGroupItem value="bold">B</ToggleGroupItem>
            <ToggleGroupItem value="italic">I</ToggleGroupItem>
          </ToggleGroup>
          <Field>
            <FieldLabel>Email</FieldLabel>
            <Input
              placeholder="you@example.com"
              invalid
            />
            <FieldDescription>We never share your email.</FieldDescription>
            <FieldError>Invalid email</FieldError>
          </Field>
        </div>
      </section>

      <section class="playground-section">
        <h2>Charts</h2>
        <div class="playground-charts">
          <div class="playground-chart-host">
            <BarChart
              :data="chartData"
              index="month"
              :categories="['desktop', 'mobile']"
            />
          </div>
          <div class="playground-chart-host">
            <LineChart
              :data="chartData"
              index="month"
              :categories="['desktop', 'mobile']"
              :smooth="true"
            />
          </div>
          <div class="playground-chart-host">
            <AreaChart
              :data="chartData"
              index="month"
              :categories="['desktop', 'mobile']"
            />
          </div>
          <div class="playground-chart-host">
            <PieChart
              :data="pieData"
              data-key="value"
              name-key="name"
            />
          </div>
        </div>
      </section>

      <section class="playground-section">
        <h2>Command Dialog</h2>
        <PrimaryButton @click="commandDialogOpen = true">Open command palette</PrimaryButton>
        <CommandDialog v-model:open="commandDialogOpen">
          <CommandInput placeholder="Type a command…" />
          <CommandList>
            <CommandEmpty>No results.</CommandEmpty>
            <CommandGroup heading="Actions">
              <CommandItem value="calendar">Calendar</CommandItem>
              <CommandItem value="search">Search</CommandItem>
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </section>

      <section class="playground-section">
        <h2>Table of Contents</h2>
        <TableOfContents :data="tocItems" />
      </section>

      <section class="playground-section">
        <h2>Carousel</h2>
        <div class="-mx-4">
          <Carousel class="w-full">
            <CarouselContent>
              <CarouselItem
                v-for="n in 5"
                :key="n"
              >
                <div
                  class=":uno: border-border flex aspect-[16/9] items-center justify-center rounded-lg border bg-white text-4xl font-semibold text-neutral-800"
                >
                  {{ n }}
                </div>
              </CarouselItem>
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>

      <section class="playground-section">
        <h2>Modal</h2>
        <p class="playground-muted">
          Built-in layouts, custom layouts via <code>:layout</code>, and
          <code>createTypedModal</code>.
        </p>

        <h3 class="m-0 text-base font-semibold text-neutral-800">Built-in layouts</h3>
        <div class="playground-row">
          <PrimaryButton @click="defaultModalRef?.open()">Default (with footer)</PrimaryButton>
          <PrimaryButton @click="fullscreenOpen = true">Fullscreen</PrimaryButton>
          <PrimaryButton @click="bottomSheetOpen = true">Responsive bottom sheet</PrimaryButton>
          <PrimaryButton @click="persistentOpen = true">Persistent (not closable)</PrimaryButton>
          <PrimaryButton @click="themedOpen = true">Themed (custom classes)</PrimaryButton>
          <PrimaryButton @click="stackedOuter = true">Stacked modals</PrimaryButton>
        </div>

        <h3 class="m-0 text-base font-semibold text-neutral-800">Custom layouts</h3>
        <div class="playground-row">
          <PrimaryButton @click="heroOpen = true">Branded hero</PrimaryButton>
          <PrimaryButton @click="drawerOpen = true">Right drawer</PrimaryButton>
          <PrimaryButton @click="confirmOpen = true">Confirm dialog (danger)</PrimaryButton>
        </div>
        <p
          v-if="lastConfirmAction"
          class="playground-muted"
        >
          Last confirm action: <strong>{{ lastConfirmAction }}</strong>
        </p>
      </section>

      <section class="playground-section">
        <h2>Calendar</h2>
        <Calendar v-model="calendarDate" />
        <p class="playground-muted">Selected: {{ calendarDate?.toLocaleDateString() ?? 'none' }}</p>
      </section>

      <section class="playground-section">
        <h2>Date &amp; number inputs</h2>
        <div class="playground-stack">
          <div>
            <Label class="block">DatePicker (v-calendar):</Label>
            <DatePicker v-model="datePickerValue" />
            <p class="playground-muted">
              Selected: {{ datePickerValue?.toLocaleDateString() ?? 'none' }}
            </p>
          </div>
          <div>
            <DateInput
              v-model="dateInputValue"
              label="DateInput"
            />
            <p class="playground-muted">
              Value: {{ dateInputValue?.toLocaleDateString() ?? 'none' }}
            </p>
          </div>
          <div>
            <Label>InputNumber</Label>
            <InputNumber v-model="inputNumberValue" />
            <p class="playground-muted">Value: {{ inputNumberValue }}</p>
          </div>
        </div>
      </section>

      <section class="playground-section">
        <h2>BaseDropdown &amp; phone</h2>
        <div class="playground-stack">
          <BaseDropdown
            v-model="dropdownItem"
            :items="dropdownItems"
          >
            <PrimaryButton>{{ dropdownItem?.label ?? 'Pick an action' }}</PrimaryButton>
          </BaseDropdown>
          <CountryDropdown v-model="countryCode">
            <PrimaryButton variant="outline">Country: {{ countryCode ?? 'none' }}</PrimaryButton>
          </CountryDropdown>
          <PhoneNumberInput
            v-model="phoneNumber"
            :country-code="countryCode"
            label="Phone"
          />
          <p class="playground-muted">Phone: {{ phoneNumber || 'none' }}</p>
        </div>
      </section>

      <section class="playground-section">
        <h2>Countdown</h2>
        <Countdown :start-date="countdownStart" />
      </section>

      <section class="playground-section">
        <h2>Toaster &amp; Toast</h2>
        <PrimaryButton @click="notify">Show toast</PrimaryButton>
      </section>
    </main>

    <!-- ===== Modal instances ===== -->

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
          <PrimaryButton @click="defaultModalRef?.close()">Confirm</PrimaryButton>
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
      <p class="text-sm text-neutral-500">Tried to close: {{ persistentTriedToClose }} time(s)</p>
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
          <label class="text-sm font-medium text-neutral-700">Display name</label>
          <input
            type="text"
            class="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2"
            placeholder="Jane Doe"
          />
        </div>
        <div>
          <label class="text-sm font-medium text-neutral-700">Email</label>
          <input
            type="email"
            class="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2"
            placeholder="jane@example.com"
          />
        </div>
        <p class="text-xs text-neutral-500">
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
