import type { LucideIcon } from "lucide-react";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpDown,
  Calculator,
  Calendar,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronsDown,
  ChevronsLeft,
  ChevronsRight,
  ChevronsUp,
  ChevronsUpDown,
  Circle,
  CircleAlert,
  CircleCheck,
  CircleDot,
  Cloud,
  Copy,
  Database,
  Dot,
  EllipsisVertical,
  ExternalLink,
  Eye,
  FileSpreadsheet,
  FileText,
  BookOpen,
  Github,
  GripHorizontal,
  GripVertical,
  Hash,
  Info,
  Layers,
  LayoutDashboard,
  LayoutGrid,
  LifeBuoy,
  Lightbulb,
  List,
  LoaderPinwheel,
  Lock,
  Menu,
  Merge,
  Monitor,
  Moon,
  Pencil,
  Plus,
  RefreshCw,
  RotateCcw,
  Search,
  Settings,
  Shield,
  Sparkles,
  SquareCheck,
  Sun,
  Table,
  Terminal,
  ToggleLeft,
  Trash2,
  TrendingUp,
  Type,
  User,
  Users,
  Bell,
  X,
} from "lucide-react";

// Type export
export type { LucideIcon };

// ============================================================================
// SEMANTIC ICON EXPORTS
// All icons use semantic names that describe their purpose/action,
// not their visual appearance. One icon = one export name.
// All semantic exports end with "Icon" for consistency.
// ============================================================================

// Navigation & Layout
export {
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  ArrowUpDown as ArrowUpDownIcon,
  ChevronDown as ChevronDownIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  ChevronUp as ChevronUpIcon,
  ChevronsDown as ChevronsDownIcon,
  ChevronsLeft as ChevronsLeftIcon,
  ChevronsRight as ChevronsRightIcon,
  ChevronsUp as ChevronsUpIcon,
  ChevronsUpDown as ChevronsUpDownIcon,
  GripHorizontal as DragHandleIcon,
  GripVertical as DragHandleVerticalIcon,
  Menu as MenuIcon,
};

// Pages & Views
export { LayoutDashboard as DashboardIcon, LayoutGrid as GridIcon };

// Actions
export {
  X as CloseIcon,
  Copy as CopyIcon,
  Trash2 as DeleteIcon,
  Pencil as EditIcon,
  ExternalLink as ExternalLinkIcon,
  Eye as EyeIcon,
  Merge as MergeIcon,
  Plus as PlusIcon,
  RefreshCw as RefreshIcon,
};

// Settings & Configuration
export {
  Lock as LockIcon,
  EllipsisVertical as MoreIcon,
  Settings as SettingsIcon,
  Shield as ShieldIcon,
};

// Theme & Appearance
export {
  Moon as DarkModeIcon,
  Sun as LightModeIcon,
  Monitor as SystemModeIcon,
  RotateCcw as ResetIcon,
};

// Data Visualization
export { TrendingUp as ChartIcon, Layers as LayersIcon, List as ListIcon, Table as TableIcon };

// Data Sources & Files
export {
  Calculator as CalculatorIcon,
  Cloud as CloudIcon,
  Database as DatabaseIcon,
  FileText as FileIcon,
  BookOpen as NotionIcon,
  FileSpreadsheet as SpreadsheetIcon,
};

// Brands
export { Github as GithubIcon };

// Status & Feedback
export {
  CircleAlert as AlertCircleIcon,
  CircleCheck as CheckCircleIcon,
  Check as CheckIcon,
  SquareCheck as CheckSquareIcon,
  Info as InfoIcon,
  LoaderPinwheel as LoaderIcon,
  CircleDot as PendingIcon,
};

// Data Types
export {
  ToggleLeft as BooleanTypeIcon,
  Calendar as DateTypeIcon,
  Hash as NumberTypeIcon,
  Type as TextTypeIcon,
};

// UI Elements
export { Circle as CircleIcon, CircleDot as DataPointIcon, Dot as DotIcon };

// People & Notifications
export { Bell as BellIcon, User as UserIcon, Users as UsersIcon };

// Utilities
export {
  LifeBuoy as HelpIcon,
  Lightbulb as LightbulbIcon,
  Search as SearchIcon,
  Sparkles as SparklesIcon,
  Terminal as TerminalIcon,
};
