import icAssessment from '@iconify/icons-ic/twotone-assessment';
import icAssigment from '@iconify/icons-ic/twotone-assignment';
import icAttachMoney from '@iconify/icons-ic/twotone-attach-money';
import icBubbleChart from '@iconify/icons-ic/twotone-bubble-chart';
import icContacts from '@iconify/icons-ic/twotone-contacts';
import icHelp from '@iconify/icons-ic/twotone-help';
import icLayers from '@iconify/icons-ic/twotone-layers';
import icPictureInPicture from '@iconify/icons-ic/twotone-picture-in-picture';
import icStar from '@iconify/icons-ic/twotone-star';
import icUpdate from '@iconify/icons-ic/twotone-update';
import icViewCompact from '@iconify/icons-ic/twotone-view-compact';


export const sidebarPdgContent = [

    {
        type: 'link',
        label: 'Chef Dashboard',
        route: '/chef',
        icon: icLayers,
        routerLinkActiveOptions: { exact: true }
    },
]

export const sidebarAdminContent = [

    {
        type: 'link',
        label: 'Utilisateurs',
        route: '/users',
        icon: icLayers,
        routerLinkActiveOptions: { exact: true }
    },
    {
        type: 'link',
        label: 'Cautions',
        route: '/caution',
        icon: icLayers,
        routerLinkActiveOptions: { exact: true }
    }
]

export const sidebarReceptionAgentContent = [

    {
        type: 'link',
        label: 'Chef Dashboard',
        route: '/chef',
        icon: icLayers,
        routerLinkActiveOptions: { exact: true }
    },
]

export const sidebarApprobationAgentContent = [

    {
        type: 'link',
        label: 'Chef Dashboard',
        route: '/chef',
        icon: icLayers,
        routerLinkActiveOptions: { exact: true }
    },
]
