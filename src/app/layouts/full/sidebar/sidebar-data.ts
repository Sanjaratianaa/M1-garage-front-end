import { NavItem } from './nav-item/nav-item';

function filterNavItems(navItems: NavItem[], userRole: string): NavItem[] {
  return navItems.filter(item => {
    if (item.navCap || item.divider) {
      return true;
    }

    if (userRole === 'manager') {
      return (
        item.displayName === 'Mecanicien' ||
        item.displayName === 'Dashboard' ||
        item.displayName === 'Service' ||
        item.displayName === 'Sous Service' ||
        item.displayName === 'Prix Sous Service' ||
        item.navCap === 'Home' ||
        item.navCap === 'Voiture' ||
        item.displayName === 'Categorie' ||
        item.displayName === 'Marque' ||
        item.displayName === 'Modele' ||
        item.displayName === 'Type de Transmission' ||
        item.displayName === 'Pièce détachée' ||
        item.displayName === 'Voiture' ||
        item.displayName === 'Specialité'
      );

    } else if (userRole === 'client') {
      return (
        item.displayName === 'Rendez-Vous' ||
        item.displayName === 'Dashboard' ||
        item.navCap === 'Home' ||
        item.navCap === 'Voiture' ||
        item.displayName === 'Categorie' ||
        item.displayName === 'Marque' ||
        item.displayName === 'Modele' ||
        item.displayName === 'Type de Transmission' ||
        item.displayName === 'Pièce détachée' ||
        item.displayName === 'Voiture'
      );
    } else if (userRole === 'mecanicien') {
      return (
        item.displayName === 'Rendez-Vous' ||
        item.displayName === 'Dashboard' ||
        item.displayName === 'Service' ||
        item.displayName === 'Sous Service' ||
        item.displayName === 'Prix Sous Service' ||
        item.navCap === 'Home' ||
        item.navCap === 'Voiture' ||
        item.displayName === 'Categorie' ||
        item.displayName === 'Marque' ||
        item.displayName === 'Modele' ||
        item.displayName === 'Type de Transmission' ||
        item.displayName === 'Pièce détachée' ||
        item.displayName === 'Voiture' ||
        item.displayName === 'Specialité'
      );
    }

    return false; // Hide by default if no role matches
  });
}

export function getNavItemsForRole(userRole: string): NavItem[] {
  const allNavItems: NavItem[] = [
    {
      navCap: 'Home',
    },
    {
      displayName: 'Dashboard',
      iconName: 'solar:widget-add-line-duotone',
      route: '/dashboard',
    },

    {
      navCap: 'Voiture',
      divider: true
    },
    {
      displayName: 'Voiture',
      iconName: 'solar:bill-list-line-duotone',
      route: '/voiture',
    },
    {
      displayName: 'Categorie',
      iconName: 'solar:bill-list-line-duotone',
      route: '/voiture/categorie',
    },
    {
      displayName: 'Marque',
      iconName: 'solar:bill-list-line-duotone',
      route: '/voiture/marque',
    },
    {
      displayName: 'Modele',
      iconName: 'solar:bill-list-line-duotone',
      route: '/voiture/modele',
    },
    {
      displayName: 'Type de Transmission',
      iconName: 'solar:bill-list-line-duotone',
      route: '/voiture/type-transmission',
    },
    {
      displayName: 'Pièce détachée',
      iconName: 'solar:widget-2-line-duotone',
      route: '',
      children: [
        {
          displayName: 'Piece',
          subItemIcon: true,
          iconName: 'solar:bill-list-line-duotone',
          route: '/voiture/piece',
        },
        {
          displayName: 'Gestion Stock',
          subItemIcon: true,
          iconName: 'solar:bill-list-line-duotone',
          route: '/voiture/piece/gestion-stock',
        },
        {
          displayName: 'Stock Piece',
          subItemIcon: true,
          iconName: 'solar:bill-list-line-duotone',
          route: '/voiture/piece/stock',
        },
        {
          displayName: 'Gestion Prix Piece',
          subItemIcon: true,
          iconName: 'solar:bill-list-line-duotone',
          route: '/voiture/piece/prix',
        },
      ],
    },

    {
      navCap: 'Service',
      divider: true
    },
    {
      displayName: 'Service',
      iconName: 'fluent-mdl2:service-off',
      route: '/service',
    },
    {
      displayName: 'Sous Service',
      iconName: 'fluent-mdl2:service-off',
      route: '/service/sous-service',
    },
    {
      displayName: 'Prix Sous Service',
      iconName: 'fluent-mdl2:service-off',
      route: '/service/prix-sous-service',
    },

    {
      divider: true,
      navCap: 'MECANICIEN',
    },
    {
      displayName: 'Mecanicien',
      iconName: 'solar:user-id-line-duotone',
      route: '/personne',
      chip: true,
    },
    {
      displayName: 'Specialité',
      iconName: 'solar:bill-list-line-duotone',
      route: '/specialite',
      chip: true,
    },
    {
      displayName: 'Rendez-Vous',
      iconName: 'solar:bookmark-square-minimalistic-line-duotone',
      route: '/rendez-vous',
    },
    {
      displayName: 'Notes',
      iconName: 'solar:document-text-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/apps/notes',
      chip: true,
      external: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Tickets',
      iconName: 'solar:ticket-sale-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/apps/tickets',
      chip: true,
      external: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'ToDo',
      iconName: 'solar:airbuds-case-minimalistic-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/apps/todo',
      chip: true,
      external: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Invoice',
      iconName: 'solar:bill-list-line-duotone',
      route: '',
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
      children: [
        {
          displayName: 'List',
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/apps/invoice',
          chip: true,
          external: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
        {
          displayName: 'Detail',
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/apps/viewInvoice/101',
          chip: true,
          external: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
        {
          displayName: 'Create',
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/apps/addInvoice',
          chip: true,
          external: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
        {
          displayName: 'Edit',
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/apps/editinvoice/101',
          chip: true,
          external: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
      ],
    },
    {
      displayName: 'Blog',
      iconName: 'solar:widget-4-line-duotone',
      route: 'apps/blog',
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
      children: [
        {
          displayName: 'Post',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/apps/blog/post',
          chip: true,
          external: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
        {
          displayName: 'Detail',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/apps/blog/detail/Early Black Friday Amazon deals: cheap TVs, headphones, laptops',
          chip: true,
          external: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
      ],
    },

    {
      navCap: 'Ui Components',
      divider: true
    },
    {
      displayName: 'Badge',
      iconName: 'solar:archive-minimalistic-line-duotone',
      route: '/ui-components/badge',
    },
    {
      displayName: 'Chips',
      iconName: 'solar:danger-circle-line-duotone',
      route: '/ui-components/chips',
    },
    {
      displayName: 'Menu',
      iconName: 'solar:file-text-line-duotone',
      route: '/ui-components/menu',
    },
    {
      displayName: 'Tooltips',
      iconName: 'solar:text-field-focus-line-duotone',
      route: '/ui-components/tooltips',
    },
    {
      displayName: 'Forms',
      iconName: 'solar:file-text-line-duotone',
      route: '/ui-components/forms',
    },
    {
      displayName: 'Tables',
      iconName: 'solar:tablet-line-duotone',
      route: '/ui-components/tables',
    },
    {
      displayName: 'Expansion Panel',
      iconName: 'solar:inbox-archive-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/ui-components/expansion',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Dialog',
      iconName: 'solar:bolt-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/ui-components/dialog',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Divider',
      iconName: 'solar:menu-dots-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/ui-components/divider',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Paginator',
      iconName: 'solar:tuning-2-bold-duotone',
      route: 'https://matdash-angular-main.netlify.app/ui-components/paginator',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Progress Bar',
      iconName: 'solar:restart-bold-duotone',
      route: 'https://matdash-angular-main.netlify.app/ui-components/progress',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Progress Spinner',
      iconName: 'solar:refresh-circle-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/ui-components/progress-spinner',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Ripples',
      iconName: 'solar:branching-paths-up-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/ui-components/ripples',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Slide Toggle',
      iconName: 'solar:round-alt-arrow-right-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/ui-components/slide-toggle',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Slider',
      iconName: 'solar:tuning-3-bold-duotone',
      route: 'https://matdash-angular-main.netlify.app/ui-components/slider',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Snackbar',
      iconName: 'solar:layers-minimalistic-bold-duotone',
      route: 'https://matdash-angular-main.netlify.app/ui-components/snackbar',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Tabs',
      iconName: 'solar:box-minimalistic-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/ui-components/tabs',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Toolbar',
      iconName: 'solar:balloon-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/ui-components/toolbar',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Tooltips',
      iconName: 'solar:feed-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/ui-components/tooltips',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },

    {
      divider: true,
      navCap: 'Pages',
    },
    {
      displayName: 'Roll Base Access',
      iconName: 'solar:lock-password-unlocked-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/apps/permission',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Treeview',
      iconName: 'solar:bill-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/theme-pages/treeview',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Pricing',
      iconName: 'solar:dollar-minimalistic-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/theme-pages/pricing',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Account Setting',
      iconName: 'solar:accessibility-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/theme-pages/account-setting',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'FAQ',
      iconName: 'solar:question-square-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/theme-pages/faq',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Landingpage',
      iconName: 'solar:layers-minimalistic-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/landingpage',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Widgets',
      iconName: 'solar:widget-2-line-duotone',
      route: 'widgets',
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
      children: [
        {
          displayName: 'Cards',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/widgets/cards',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
        {
          displayName: 'Banners',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/widgets/banners',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
        {
          displayName: 'Charts',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/widgets/charts',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
      ],
    },

    {
      navCap: 'Extra',
      divider: true
    },
    {
      displayName: 'Icons',
      iconName: 'solar:sticker-smile-circle-2-line-duotone',
      route: '/extra/icons',
    },
    {
      displayName: 'Sample Page',
      iconName: 'solar:planet-3-line-duotone',
      route: '/extra/sample-page',
    },

    {
      divider: true,
      navCap: 'Forms',
    },
    {
      displayName: 'Form elements',
      iconName: 'solar:password-minimalistic-input-line-duotone',
      route: 'forms/forms-elements',
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
      children: [
        {
          displayName: 'Autocomplete',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/forms/forms-elements/autocomplete',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
        {
          displayName: 'Button',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/forms/forms-elements/button',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
        {
          displayName: 'Checkbox',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/forms/forms-elements/checkbox',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
        {
          displayName: 'Radio',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/forms/forms-elements/radio',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
        {
          displayName: 'Datepicker',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/forms/forms-elements/datepicker',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
      ],
    },
    {
      displayName: 'Form Layouts',
      iconName: 'solar:file-text-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/forms/form-layouts',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Form Horizontal',
      iconName: 'solar:align-horizonta-spacing-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/forms/form-horizontal',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Form Vertical',
      iconName: 'solar:align-vertical-spacing-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/forms/form-vertical',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Form Wizard',
      iconName: 'solar:archive-minimalistic-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/forms/form-wizard',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Toastr',
      iconName: 'solar:notification-lines-remove-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/forms/form-toastr',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },

    {
      divider: true,
      navCap: 'Tables',
    },
    {
      displayName: 'Tables',
      iconName: 'solar:tablet-line-duotone',
      route: 'tables',
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
      children: [
        {
          displayName: 'Basic Table',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/tables/basic-table',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
        {
          displayName: 'Dynamic Table',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/tables/dynamic-table',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
        {
          displayName: 'Expand Table',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/tables/expand-table',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
        {
          displayName: 'Filterable Table',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/tables/filterable-table',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
        {
          displayName: 'Footer Row Table',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/tables/footer-row-table',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
        {
          displayName: 'HTTP Table',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/tables/http-table',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
        {
          displayName: 'Mix Table',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/tables/mix-table',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
        {
          displayName: 'Multi Header Footer',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/tables/multi-header-footer-table',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
        {
          displayName: 'Pagination Table',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/tables/pagination-table',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
        {
          displayName: 'Row Context Table',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/tables/row-context-table',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
        {
          displayName: 'Selection Table',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/tables/selection-table',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
        {
          displayName: 'Sortable Table',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/tables/sortable-table',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
        {
          displayName: 'Sticky Column',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/tables/sticky-column-table',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
        {
          displayName: 'Sticky Header Footer',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/tables/sticky-header-footer-table',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
      ],
    },
    {
      displayName: 'Data table',
      iconName: 'solar:database-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/datatable/kichen-sink',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },

    {
      divider: true,
      navCap: 'Chart',
    },
    {
      displayName: 'Line',
      iconName: 'solar:align-top-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/charts/line',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Gredient',
      iconName: 'solar:bolt-circle-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/charts/gredient',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Area',
      iconName: 'solar:chart-square-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/charts/area',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Candlestick',
      iconName: 'solar:align-left-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/charts/candlestick',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Column',
      iconName: 'solar:chart-2-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/charts/column',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Doughnut & Pie',
      iconName: 'solar:pie-chart-2-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/charts/doughnut-pie',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Radialbar & Radar',
      iconName: 'solar:align-vertical-center-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/charts/radial-radar',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },

    {
      divider: true,
      navCap: 'Auth',
    },
    {
      displayName: 'Login',
      iconName: 'solar:lock-keyhole-minimalistic-line-duotone',
      route: '/authentication',
      children: [
        {
          displayName: 'Login',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: '/authentication/login',
        },
        {
          displayName: 'Side Login',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/authentication/boxed-login',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
      ],
    },
    {
      displayName: 'Register',
      iconName: 'solar:user-plus-rounded-line-duotone',
      route: '/authentication',
      children: [
        {
          displayName: 'Register',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: '/authentication/register',
        },
        {
          displayName: 'Side Register',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/authentication/boxed-register',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
      ],
    },
    {
      displayName: 'Forgot Pwd',
      iconName: 'solar:password-outline',
      route: '/authentication',
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
      children: [
        {
          displayName: 'Side Forgot Pwd',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/authentication/side-forgot-pwd',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
        {
          displayName: 'Boxed Forgot Pwd',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/authentication/boxed-forgot-pwd',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
      ],
    },
    {
      displayName: 'Two Steps',
      iconName: 'solar:siderbar-line-duotone',
      route: '/authentication',
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
      children: [
        {
          displayName: 'Side Two Steps',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/authentication/side-two-steps',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
        {
          displayName: 'Boxed Two Steps',
          subItemIcon: true,
          iconName: 'solar:round-alt-arrow-right-line-duotone',
          route: 'https://matdash-angular-main.netlify.app/authentication/boxed-two-steps',
          external: true,
          chip: true,
          chipClass: 'bg-secondary text-white',
          chipContent: 'PRO',
        },
      ],
    },
    {
      displayName: 'Error',
      iconName: 'solar:bug-minimalistic-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/authentication/error',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
    {
      displayName: 'Maintenance',
      iconName: 'solar:settings-line-duotone',
      route: 'https://matdash-angular-main.netlify.app/authentication/maintenance',
      external: true,
      chip: true,
      chipClass: 'bg-secondary text-white',
      chipContent: 'PRO',
    },
  ];

  return filterNavItems(allNavItems, userRole);
}