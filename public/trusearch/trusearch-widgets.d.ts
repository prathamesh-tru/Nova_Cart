import * as react_jsx_runtime from 'react/jsx-runtime';

interface AutocompletePanelConfig {
    id: string;
    tenantId: string;
    name: string;
    indexId: string;
    /**
     * Placeholder text for the panel's search input. When omitted, defaults to
     * "Search…". A prop override on `AutocompleteSuggestions` (e.g. from a
     * search-page search_box slot) takes precedence.
     */
    placeholder?: string;
    /**
     * Optional CSS class applied to the panel's inner content container
     * (`tws-autocomplete-panel__content`). Useful for host-app styling without
     * touching the widget source. Merged alongside any programmatic
     * `classNames.container` passed by the embedder.
     */
    containerClass?: string;
    theme: AutocompletePanelTheme;
    sections: AutocompletePanelSection[];
    createdAt: string;
    updatedAt: string;
}
interface QuickLinkEntry$1 {
    id: string;
    label: string;
    /**
     * Link URL. Supports `{searchTerm}` placeholder which is replaced with the
     * current search query at click time (e.g. `https://google.com/?q={searchTerm}`).
     */
    url: string;
    icon?: string;
    /** When true, opens in a new browser tab. Defaults to true for back-compat. */
    openInNewTab?: boolean;
}
interface PinnedItem {
    docId: string;
    position: number;
    /**
     * Optional rules that restrict when this pin applies. The pin is only
     * injected if **all** conditions match the current search prefix. An empty
     * or missing list means the pin applies unconditionally.
     */
    conditions?: PinCondition[];
}
/** Condition operators for pinning rules, matched against the search prefix. */
type PinConditionOperator = 'equals' | 'contains' | 'starts_with' | 'ends_with' | 'regex';
interface PinCondition {
    operator: PinConditionOperator;
    value: string;
    /** When true, comparison is case-sensitive. Defaults to false. */
    caseSensitive?: boolean;
}
interface AutocompletePanelSection {
    key: string;
    title: string;
    type: 'recent' | 'popular' | 'entity' | 'quick_links';
    recentMode: 'global' | 'user';
    entityType?: string;
    filterField: string;
    maxItems: number;
    displayStyle: 'list' | 'card' | 'compact';
    /**
     * Document field used as the result title. When omitted, falls back to the
     * item's own `title` or its `attributes.title` / `attributes.fields.title`.
     */
    titleField?: string;
    showImage: boolean;
    imageField: string;
    imageShape: 'circle' | 'rounded' | 'square';
    imageSize: 'small' | 'medium' | 'large';
    showSubtitle: boolean;
    subtitleField: string;
    showDate: boolean;
    dateField: string;
    dateFormat?: string;
    showSnippet: boolean;
    urlTemplate: string;
    headerUrl: string;
    column: number;
    quickLinks?: QuickLinkEntry$1[];
    pinnedItems?: PinnedItem[];
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
    excludeFromPopular?: boolean;
    /**
     * Optional per-section theme overrides. Any fields set here override the
     * panel-level theme for this section's subtree via CSS custom properties.
     * Layout fields (`width`, `maxHeight`, `columns`, `gap`) are panel-wide and
     * ignored at section level — only visual fields (`backgroundColor`,
     * `headerColor`, `hoverColor`, `borderRadius`, `shadow`) take effect.
     */
    theme?: Partial<AutocompletePanelTheme>;
    /**
     * Optional CSS class applied to this section's wrapper at render time. Adds
     * to the panel-level `containerClass`; they don't replace each other.
     */
    containerClass?: string;
}
interface AutocompletePanelTheme {
    width: string;
    maxHeight: string;
    columns: number;
    gap: number;
    borderRadius: string;
    shadow: string;
    backgroundColor: string;
    headerColor: string;
    hoverColor: string;
}
interface SuggestResponse {
    suggestions: SuggestItem[];
    prefix: string;
    latencyMs: number;
}
interface SuggestItem {
    text: string;
    score: number;
    source: string;
    category?: string;
    hitCount?: number;
    metadata?: Record<string, string>;
}
interface FederatedSuggestResponse {
    prefix: string;
    popularSearches: FederatedSuggestion[];
    recentSearches: FederatedSuggestion[];
    sections: Record<string, FederatedSection>;
    latencyMs: number;
}
interface FederatedSuggestion {
    text: string;
    score: number;
    source: string;
    category?: string | null;
    hitCount?: number;
    metadata?: Record<string, unknown>;
}
interface FederatedSection {
    key: string;
    entityType: string;
    total: number;
    items: FederatedSectionItem[];
}
interface FederatedSectionItem {
    id: string;
    title?: string;
    snippet?: string;
    url?: string;
    entityType?: string;
    score?: number;
    matchedFields?: string[];
    attributes?: Record<string, unknown>;
    HighlightResult?: Record<string, unknown>;
    SnippetResult?: Record<string, unknown>;
    pinned?: boolean;
}

/**
 * Custom class names for styling individual parts of the autocomplete panel.
 * Pass these to override or extend the default BEM classes with your own
 * (e.g., Tailwind classes, Bootstrap classes, or custom CSS modules).
 */
interface AutocompleteClassNames {
    /** Root panel container */
    panel?: string;
    /** Inner container that wraps the results grid (sits inside the panel, below the search input). */
    container?: string;
    /** Multi-column grid */
    grid?: string;
    /** Individual column */
    column?: string;
    /** Section wrapper (also receives modifier: --recent, --popular, --entity, --quick-links) */
    section?: string;
    /** Section title text */
    sectionTitle?: string;
    /** Section header (title + link) row */
    sectionHeader?: string;
    /** "View All" link in section header */
    sectionLink?: string;
    /** Items list container (wraps all items in a section) */
    list?: string;
    /** Empty state placeholder */
    empty?: string;
    /** Search term button (recent/popular items) */
    searchTerm?: string;
    /** Quick link anchor element */
    link?: string;
    /** Entity result item button */
    item?: string;
    /** Image wrapper container (wraps the img element) */
    itemImage?: string;
    /** Item content wrapper (title + subtitle + meta + snippet) */
    itemContent?: string;
    /** Item title */
    itemTitle?: string;
    /** Item subtitle */
    itemSubtitle?: string;
    /** Item meta row (wraps date and other metadata) */
    itemMeta?: string;
    /** Item date */
    itemDate?: string;
    /** Item snippet */
    itemSnippet?: string;
    /** Item image (the img element itself) */
    image?: string;
    /** Search input container */
    searchInput?: string;
    /** Search text field */
    searchField?: string;
    /** Search submit button */
    searchButton?: string;
    /** Typeahead suggestion dropdown */
    typeahead?: string;
    /** Individual typeahead suggestion item */
    typeaheadItem?: string;
    /** Loading container */
    loading?: string;
    /** Loading spinner */
    spinner?: string;
    /** Close button */
    closeButton?: string;
}
interface AutocompleteSuggestionsProps {
    id: string;
    apiUrl: string;
    apiKey?: string;
    query: string;
    onSearch?: (query: string) => void;
    /** Callback when the search button is clicked or Enter is pressed without a selection */
    onSubmit?: (query: string) => void;
    onResultClick?: (id: string, url?: string, entityType?: string) => void;
    /** Fires when the panel closes (user pressed Escape, clicked outside, or clicked the close button). */
    onClose?: () => void;
    className?: string;
    /**
     * Custom class names for styling individual parts of the panel.
     * Merged with default BEM classes — your classes are appended, not replaced.
     *
     * @example
     * ```tsx
     * <AutocompleteSuggestions
     *   classNames={{
     *     searchButton: 'bg-blue-600 text-white rounded-full px-6',
     *     item: 'hover:bg-blue-50',
     *     image: 'ring-2 ring-blue-200',
     *   }}
     * />
     * ```
     */
    classNames?: AutocompleteClassNames;
    /** Pass config directly to bypass API fetch (used by the builder preview). */
    configOverride?: AutocompletePanelConfig;
    /** Pass suggest data directly to bypass API fetch (used by the builder preview). */
    dataOverride?: FederatedSuggestResponse | null;
    /** Custom fetch function to bypass the built-in API client (e.g., use host app's auth). */
    fetchFn?: (command: string, payload: Record<string, unknown>) => Promise<FederatedSuggestResponse>;
    /** Render inline (static position, full width) instead of as a dropdown overlay. */
    inline?: boolean;
    /** Session hash for identifying the user session (used for per-user query tracking on the server). */
    sessionHash?: string;
    /** Show a search input with submit button inside the panel */
    showSearchInput?: boolean;
    /**
     * Placeholder text for the search input. Takes precedence over
     * `config.placeholder`. Falls back to "Search…" when neither is set.
     */
    placeholder?: string;
    /**
     * Force the suggestions panel to always stay open, ignoring focus/escape/outside-click.
     * Used only for static previews (e.g. the config builder). Defaults to false.
     */
    forceOpen?: boolean;
}
declare function AutocompleteSuggestions({ id, apiUrl, apiKey, query, onSearch, onSubmit, onResultClick, onClose, className, classNames: cx, configOverride, dataOverride, fetchFn, inline, sessionHash, showSearchInput, placeholder, forceOpen, }: AutocompleteSuggestionsProps): react_jsx_runtime.JSX.Element | null;

type WidgetTypeId = 'search_box' | 'results_list' | 'facet_panel' | 'pagination' | 'stats_bar' | 'ai_answer_card' | 'steps_card' | 'knowledge_card' | 'comparison_table' | 'ranked_list' | 'chart_widget' | 'recommendation_carousel' | 'map_widget' | 'calendar_card' | 'quick_links' | 'content_block' | 'sort_selector' | 'alpha_filter' | 'no_results_page';
interface WidgetLayoutItem {
    i: string;
    x: number;
    y: number;
    w: number;
    h: number;
    minW?: number;
    minH?: number;
    static?: boolean;
}
interface WidgetLayout {
    breakpoints: {
        lg: WidgetLayoutItem[];
        md: WidgetLayoutItem[];
        sm: WidgetLayoutItem[];
    };
    cols: {
        lg: number;
        md: number;
        sm: number;
    };
    rowHeight: number;
}
interface WidgetTheme {
    primaryColor: string;
    fontFamily: string;
    borderRadius: string;
    spacingUnit: string;
    cssVariables?: Record<string, string>;
}

/**
 * Top-level search page widget configuration.
 *
 * Mirrors the AutocompletePanelConfig pattern: a name, an index, a theme, and
 * an ordered list of self-describing slots. Each slot's per-widget settings
 * live directly on the slot (no nested config blob), so the schema is flat,
 * type-safe, and trivially serializable.
 */
interface SearchPageWidgetConfig {
    id: string;
    tenantId: string;
    name: string;
    indexId: string;
    /** Default search behaviour applied to every query */
    searchConfig?: SearchConfig;
    theme: WidgetTheme;
    /**
     * Optional CSS class(es) applied to the root panel wrapper. Space-separated
     * multi-class values are accepted. Composes with the built-in
     * `tws-envelope tws-root` classes.
     */
    containerClass?: string;
    /**
     * Google Maps JavaScript API key for this tenant. Injected by the engine
     * from `TenantInfo.googleMapsApiKey`; used by the standalone `map_widget`
     * slot and the `geo_distance` facet. Restrict the key by HTTP referrer in
     * Google Cloud Console — it is shipped to the browser.
     */
    googleMapsApiKey?: string;
    /** Ordered list of widget slots */
    slots: WidgetSlot[];
    /** Visual layout (RGL grid by breakpoint). When omitted, slots stack vertically. */
    layout?: WidgetLayout;
    createdAt: string;
    updatedAt: string;
}
/**
 * Page-level search configuration shared by all widgets.
 */
interface SearchConfig {
    /** Always-applied filters (e.g. type=article). Combined with user-selected facet filters. */
    defaultConditions?: SearchCondition[];
    /** Restrict full-text matching to specific fields. Empty/omitted = all searchable fields. */
    fulltextFields?: string[];
}
interface SearchCondition {
    field: string;
    operator: '=' | '!=' | '>' | '<' | '>=' | '<=' | 'IN' | 'NOT_IN';
    /** Filter value. Use `boolean` for boolean fields and `number` for numeric fields so the engine emits a typed term query against the raw field (no `.keyword` subfield). */
    value: string | boolean | number;
}
/**
 * A single widget slot in a search page configuration.
 *
 * Following the AutocompletePanelSection pattern, every widget-type-specific
 * field lives directly on this object — no nested `config` blob. The `type`
 * field discriminates which fields are meaningful; irrelevant fields are
 * simply ignored by the renderer.
 */
interface WidgetSlot {
    /** Stable unique key for this slot (used as React key and as the layout item id). */
    key: string;
    /** Widget type discriminator. */
    type: WidgetTypeId;
    /** Display title rendered above the widget body. */
    title: string;
    /**
     * Optional per-slot theme overrides. Fields left unset inherit from the
     * panel-level theme. Mirrors the {@link AutocompletePanelSection} pattern:
     * values are scoped to this slot's wrapper via CSS custom properties so
     * nested children pick them up without the panel having to know.
     */
    theme?: Partial<WidgetTheme>;
    /**
     * Optional CSS class(es) applied to this slot's outer wrapper. Composes with
     * the built-in `tws-widget tws-widget--{type}` classes. Space-separated
     * multi-class values are accepted.
     */
    containerClass?: string;
    /**
     * Key of the `results_list` slot this widget is bound to. Used by
     * `facet_panel`, `pagination`, and `stats_bar` to pick which list's
     * response provides aggregations / totals. Defaults to the first
     * `results_list` slot in the config. Not used by `ai_answer_card` —
     * AI answers fire their own dedicated search.
     */
    targetSlotKey?: string;
    /** Placeholder text shown inside the search input. */
    placeholder?: string;
    /** ID of an autocomplete panel config. When set, the search box renders the panel inline. */
    autocompletePanelId?: string;
    /** Per-slot always-applied conditions (federated results). Merged with page-level defaultConditions. */
    slotConditions?: SearchCondition[];
    /** When true, user-selected facet filters are NOT applied to this list's search. */
    excludeGlobalFacetFilters?: boolean;
    /** Per-slot page size override. Falls back to pagination slot's pageSize, then PAGE_SIZE_DEFAULT. */
    slotPageSize?: number;
    /** Card layout mode. */
    viewMode?: 'list' | 'grid' | 'compact';
    /** Number of columns when viewMode is 'grid'. */
    gridColumns?: 2 | 3 | 4;
    /** Document field for the card title. */
    titleField?: string;
    /** Document field for the subtitle line. */
    subtitleField?: string;
    /** Document field for the description text. Falls back to hit.snippet when empty. */
    snippetField?: string;
    /** Document field for the card image URL. */
    imageField?: string;
    /** Image rendering shape. */
    imageShape?: 'circle' | 'rounded' | 'square';
    /** Document field for a coloured badge/tag. */
    badgeField?: string;
    /** Document field for a date string or timestamp. */
    dateField?: string;
    /** date-fns format token for the dateField. */
    dateFormat?: string;
    /** Document field for the click-through URL (literal value). */
    urlField?: string;
    /** URL template with `{field}` placeholders, e.g. `/profile/{id}`. */
    urlTemplate?: string;
    /** Document field for a location/address line. */
    locationField?: string;
    /** Document field for a phone number. */
    phoneField?: string;
    /** Document field for a price/amount. */
    priceField?: string;
    /** Document field for a rating (numeric 0-5). */
    ratingField?: string;
    /** Number of lines to clamp subtitle/snippet text to before showing "Show more". Default 3. */
    textClampLines?: number;
    /** Optional CTA buttons rendered at the bottom of each card. */
    ctaButtons?: CtaButton[];
    /** Available view modes the user can toggle between. */
    enabledViews?: ('list' | 'grid')[];
    /**
     * Optional "View all" link rendered in the results list header. Supports
     * the `{searchTerm}` placeholder, replaced at click time with the current
     * search query.
     */
    viewAllUrl?: string;
    /** Label for the "View all" link. Defaults to "View all". */
    viewAllLabel?: string;
    /** When true, the View all link opens in a new tab. Defaults to false. */
    viewAllOpenInNewTab?: boolean;
    /**
     * What to render when this results_list slot returns zero items:
     * - `'default'` (or unset): show the built-in "No results found." message
     * - `'hide'`: don't render the slot at all
     * - `'custom'`: render `noResultsHtml` (sanitized by the host) inside the slot
     */
    noResultsMode?: 'default' | 'hide' | 'custom';
    /** HTML rendered when `noResultsMode === 'custom'` and items is empty. */
    noResultsHtml?: string;
    /**
     * Fixed sort order auto-applied to this list's search. Unlike the
     * user-facing `sort_selector` slot, this is never exposed in the UI — the
     * author locks the order (e.g. "always show events by soonest upcoming").
     * Any active user sort (from a `sort_selector` slot or URL state) still
     * wins; `slotSort` is the fallback used when the user has not picked a sort.
     */
    slotSort?: {
        field: string;
        direction: 'asc' | 'desc';
    };
    /** Configured facet groups rendered in this panel. */
    facets?: FacetField[];
    /** Number of results per page (defaults to 10). */
    pageSize?: number;
    /** Available sort options users can pick from. */
    sortOptions?: SortOption[];
    /** ID of the default sort option. Null/undefined = Relevance. */
    defaultSortOption?: string;
    /** Show search execution time. */
    showDuration?: boolean;
    /** Show the search mode label (hybrid/keyword/semantic). */
    showMode?: boolean;
    /** Show an "AI" badge when an AI answer is present. */
    showAiBadge?: boolean;
    /** Show the model name beneath the answer. */
    showModel?: boolean;
    /** Show citation chips below the answer. */
    showCitations?: boolean;
    /** Show thumbs up/down feedback buttons. */
    showFeedback?: boolean;
    /**
     * Additional hard filters layered on top of the page-level `defaultConditions`
     * for the dedicated RAG search. Lets the AI draw context from a different
     * subset of the corpus than any visible `results_list`.
     */
    ragConditions?: SearchCondition[];
    /**
     * Number of hits to feed the LLM as RAG context. Defaults to 5; the engine
     * caps at `RagConfig.maxContextHits` (currently 20).
     */
    ragLimit?: number;
    /**
     * When true (default), the user's facet panel selections also narrow the
     * RAG context. Set false to keep AI answers stable as users filter results.
     */
    ragApplyUserFilters?: boolean;
    /** Stable block id used by clients to target injection (e.g. "ad-top"). */
    blockId?: string;
    /** Static HTML rendered when no client injection is provided. */
    fallbackHtml?: string;
    /** Minimum height for the block container. */
    minHeight?: string;
    /** Document field used to derive the first letter (e.g. "title", "name"). */
    alphaField?: string;
    /** Show counts per letter. */
    showCounts?: boolean;
    /** Include an "All" button to clear the filter. */
    showAll?: boolean;
    /** Maximum number of items to show in a ranked list. */
    maxItems?: number;
    /** Document field for the descriptive line. */
    descriptionField?: string;
    /** Document field for a thumbnail image. */
    thumbnailField?: string;
    /** Show the relevance score next to each item. */
    showScore?: boolean;
    /** Curated quick link entries. */
    quickLinks?: QuickLinkEntry[];
    /** Curated steps shown in a steps card. */
    steps?: StepItem[];
    /** Document field for the summary text. */
    summaryField?: string;
    /** Key-value fact entries rendered beneath the summary. */
    factFields?: FactField[];
    /** Document fields shown as comparison columns. */
    compareFields?: FactField[];
    /** Document field used to drive the chart's category axis (typically a facet field). */
    facetField?: string;
    /** Chart visual type. */
    chartType?: 'bar' | 'pie' | 'line';
    /**
     * Dot-path to the location(s) on each hit for a `map_widget` slot. The
     * widget auto-detects the shape: a flat `{lat, lng|lon}` object, a
     * `[lat, lng]` tuple, a `"lat,lng"` string, a `{point:{lat,lon}, label}`
     * nested object, or an array of any of the above (one marker per entry —
     * e.g. a doctor consulting at multiple hospitals).
     *
     * Distinct from `locationField` (the card's textual address line): this
     * names the geo-point source for pins on a map.
     */
    geoLocationField?: string;
    /**
     * Optional dot-path that overrides the per-marker label on a map_widget.
     * When unset each marker uses its own `label`/`name`/`title` property,
     * falling back to the hit's title.
     */
    markerLabelField?: string;
    /** Initial zoom level (1-18). */
    defaultZoom?: number;
    /** Default geo-filter radius in kilometres when the map's own radius control is used. */
    defaultRadiusKm?: number;
    /** Show the "Use my location" button on the map. */
    enableMyLocation?: boolean;
    /** Show the Google Places address autocomplete on the map. */
    enableAddressSearch?: boolean;
    /**
     * Backend geo_point field the map's radius / bounds filter should target.
     * When omitted, defaults to `geoLocationField` itself — correct for the
     * common case where the document stores the geo_point directly there
     * (or at `geoLocationField.point`, which the engine normalises).
     */
    geoField?: string;
}
interface CtaButton {
    id: string;
    /** Button label text. */
    label: string;
    /** URL template with `{field}` placeholders, e.g. `tel:{phone}`. */
    urlTemplate: string;
    /** Visual style. */
    style: 'primary' | 'secondary' | 'outline' | 'ghost';
    /** Open in a new tab. */
    openInNewTab?: boolean;
    /** Track clicks as conversions in analytics. */
    trackAsConversion?: boolean;
    /** Conversion type label (e.g. "appointment", "purchase"). */
    conversionType?: string;
    /** Document field that provides the numeric conversion value. */
    conversionValueField?: string;
}
interface FacetField {
    /** Document field to facet on. */
    field: string;
    /** Display label (defaults to the field name). */
    label?: string;
    /** Facet type discriminator. */
    type: 'terms' | 'range' | 'hierarchical' | 'date_range' | 'date_single' | 'date_grouped' | 'numeric_range' | 'geo_distance';
    /** Allow multiple selections (default true for terms). */
    multiSelect?: boolean;
    /** Start the group collapsed. */
    collapsed?: boolean;
    /** Maximum buckets to display (default 8). */
    limit?: number;
    /** Parent field for hierarchical facets. */
    dependsOn?: string;
    /**
     * Optional group name. Facets sharing the same group render together under a
     * single collapsible section headed by the group name (e.g. a "Glossary" group
     * that bundles A–Z term facets).
     */
    group?: string;
    /** Sort order for buckets. */
    sortBy?: 'count' | 'alpha';
    /** Grouping for date_grouped: 'month' or 'year'. */
    dateGroupBy?: 'month' | 'year';
    /** Date format token for date facets. */
    dateFormat?: string;
    /** Min for numeric_range slider. */
    numericMin?: number;
    /** Max for numeric_range slider. */
    numericMax?: number;
    /** Step for numeric_range slider. */
    numericStep?: number;
    /** Display unit for numeric values (e.g. "$", "km"). */
    numericUnit?: string;
    /** Selectable radius options (km) for a geo_distance facet. */
    radiusOptions?: number[];
    /** Default radius (km) selected initially in a geo_distance facet. */
    defaultRadiusKm?: number;
    /** Show a "Use my location" button in a geo_distance facet. */
    enableMyLocation?: boolean;
    /** Show a Google Places address autocomplete in a geo_distance facet. */
    enableAddressSearch?: boolean;
    /** When true, the backend sorts hits by distance from the chosen centre. */
    sortByDistance?: boolean;
}
interface SortOption {
    /** Stable unique ID for this option (UUID). Used by `defaultSortOption` to identify the default. */
    id: string;
    /** Display label (e.g. "Newest first", "Price low to high"). */
    label: string;
    /** Document field to sort on. Special value `_relevance` means "no sort param sent". */
    field: string;
    /** Sort direction. */
    direction: 'asc' | 'desc';
}
interface QuickLinkEntry {
    id: string;
    label: string;
    /**
     * Link URL. Supports `{searchTerm}` placeholder which is replaced with the
     * current search query at click time (e.g. `https://google.com/?q={searchTerm}`).
     */
    url: string;
    description?: string;
    icon?: string;
    /** When true, opens in a new browser tab. Defaults to true for back-compat. */
    openInNewTab?: boolean;
}
interface StepItem {
    title: string;
    description: string;
}
interface FactField {
    field: string;
    label: string;
}

/**
 * Function that opens an SSE stream for a given streamId and returns the
 * underlying ReadableStream. Hosts that need custom auth (e.g. cookie sessions
 * or AWS Cognito tokens that the widget package doesn't know about) provide
 * this function. The widget parses the events itself.
 */
type StreamFn = (streamId: string, signal: AbortSignal) => Promise<ReadableStream<Uint8Array> | null>;

/**
 * Custom class names for styling individual parts of the search page widget.
 * Mirrors the AutocompletePanel pattern — pass these to override or extend the
 * default BEM classes with your own (Tailwind, Bootstrap, CSS modules, etc.).
 */
interface SearchPageClassNames {
    /** Root grid container */
    root?: string;
    /** Wrapper around an individual slot */
    slot?: string;
    /** Slot title heading */
    slotTitle?: string;
    /** Search box wrapper */
    searchBox?: string;
    /** Results list container */
    resultsList?: string;
    /** Individual result card */
    resultCard?: string;
    /** Result card title */
    resultTitle?: string;
    /** Facet panel wrapper */
    facetPanel?: string;
    /** Pagination wrapper */
    pagination?: string;
    /** Sort selector wrapper */
    sortSelector?: string;
    /** Stats bar wrapper */
    statsBar?: string;
    /** AI answer card wrapper */
    aiAnswerCard?: string;
    /** Content block wrapper */
    contentBlock?: string;
    /** Empty state message */
    empty?: string;
    /** Loading skeleton */
    loading?: string;
}
interface SearchPageWidgetProps {
    /** Widget configuration ID — fetched from the engine via `search_page_widget_get`. */
    id: string;
    /** Engine API URL. */
    apiUrl: string;
    /** Engine API key. */
    apiKey?: string;
    /** Initial query. The widget owns the query state internally; this just provides the seed value. */
    query?: string;
    /** Stable session hash for analytics. Generated automatically when omitted. */
    sessionHash?: string;
    /** HMAC-hashed user ID for personalisation. */
    userId?: string;
    /** Bypass the API config fetch — used by the builder preview. */
    configOverride?: SearchPageWidgetConfig;
    /** Custom fetch function (e.g. host app's authenticated client). */
    fetchFn?: (command: string, payload: Record<string, unknown>) => Promise<any>;
    /**
     * Optional custom SSE stream opener for RAG answer streaming. When omitted,
     * the widget builds a default URL from `apiUrl` and authenticates via
     * `X-Api-Key`. Hosts that use cookie / Cognito auth or a non-standard
     * stream URL provide this function instead.
     */
    streamFn?: StreamFn;
    /**
     * Sync search state (query, page, filters, sort) to/from URL query params.
     * When true, the widget reads initial state from the URL on mount and
     * updates it as the user interacts — making every search state shareable,
     * bookmarkable, and back-button-friendly. Default: true.
     *
     * URL param format:
     *   ?q=drupal&pg.results-people=2&sort=created:desc&f.type=article&f.author=Priyanka
     */
    syncUrl?: boolean;
    /** Optional class name for the root element. */
    className?: string;
    /** Custom class names for granular styling. */
    classNames?: SearchPageClassNames;
    onSearch?: (query: string) => void;
    onResultClick?: (id: string, entityType?: string, position?: number) => void;
    onCtaClick?: (docId: string, ctaId: string, conversionType?: string, conversionValue?: number) => void;
    onPageChange?: (page: number) => void;
    onFilterChange?: (field: string, value: string | string[]) => void;
    onClearFilters?: () => void;
    onSortChange?: (field: string, direction: 'asc' | 'desc') => void;
}
/**
 * Self-contained search page widget.
 *
 * One file, one component, all state owned internally — modelled after
 * `AutocompleteSuggestions`. Clients embed this and get a fully working
 * search experience: search box, results, facets, pagination, sort. They
 * only need to pass `id`, `apiUrl`, and `apiKey`.
 *
 * Configuration follows the same pattern as autocomplete panel sections:
 * each slot is a flat object with all its widget-type-specific fields
 * directly on it — no nested config blob.
 */
declare function SearchPageWidget({ id, apiUrl, apiKey, query: queryProp, sessionHash: sessionHashProp, userId, configOverride, fetchFn, streamFn, syncUrl, className, classNames: cx, onSearch, onResultClick, onCtaClick, onPageChange, onFilterChange, onClearFilters, onSortChange, }: SearchPageWidgetProps): react_jsx_runtime.JSX.Element | null;

type FetchFn = (url: string, init: RequestInit) => Promise<Response>;
declare function commandFetch<T>(apiUrl: string, apiKey: string | undefined, command: string, payload?: Record<string, unknown>, fetchFn?: FetchFn): Promise<T>;

/**
 * Standalone entry point for CMS integration.
 *
 * This file bundles into a single IIFE that exposes `window.TruSearchWidgets`
 * with a simple `mount()` API for embedding widgets without a build step.
 *
 * Usage:
 *   <link rel="stylesheet" href="/path/to/trusearch-widgets.css" />
 *   <script src="/path/to/trusearch-widgets.iife.js"></script>
 *   <div id="search-autocomplete"></div>
 *   <script>
 *     var widget = TruSearchWidgets.mount('autocomplete', document.getElementById('search-autocomplete'), {
 *       id: 'panel-uuid-from-builder',
 *       apiUrl: 'https://search.yoursite.com',
 *       apiKey: 'tsk_your_scoped_key',
 *       showSearchInput: true,
 *       onSubmit: function(query) { window.location.href = '/search?q=' + encodeURIComponent(query); },
 *       onResultClick: function(id, url) { if (url) window.location.href = url; },
 *       classNames: {
 *         searchButton: 'your-custom-button-class',
 *       },
 *     });
 *
 *     // Update any option:
 *     widget.update({ apiKey: 'tsk_new_key', showSearchInput: false });
 *
 *     // Unmount when done:
 *     widget.unmount();
 *   </script>
 */

interface AutocompleteMountOptions {
    /** Panel config ID from the builder */
    id: string;
    /** TruSearch engine API URL (defaults to current origin + /api/v1/engine) */
    apiUrl?: string;
    /** Scoped API key (tsk_...). Optional if engine is behind auth proxy. */
    apiKey?: string;
    /** Show the search input with submit button */
    showSearchInput?: boolean;
    /** Show the panel inline (static) instead of as a dropdown overlay */
    inline?: boolean;
    /** Session hash for identifying the user session (used for per-user query tracking) */
    sessionHash?: string;
    /** Custom class names for styling */
    classNames?: AutocompleteClassNames;
    /** Called when a search suggestion is selected */
    onSearch?: (query: string) => void;
    /** Called when the search button is clicked or Enter is pressed */
    onSubmit?: (query: string) => void;
    /** Called when an entity result is clicked */
    onResultClick?: (id: string, url?: string, entityType?: string) => void;
    /** Called when the panel is closed */
    onClose?: () => void;
}
/** Controller returned by mount() to update or unmount the widget. */
interface WidgetController {
    /** Update widget options. Partial — only provided keys are changed. */
    update(options: Partial<AutocompleteMountOptions>): void;
    /** Unmount the widget and clean up the React root. */
    unmount(): void;
}
interface SearchPageMountOptions {
    /** Widget config ID from the builder */
    id: string;
    /** TruSearch engine API URL */
    apiUrl?: string;
    /** Scoped API key */
    apiKey?: string;
    /** Initial search query */
    query?: string;
    /** HMAC-hashed user ID for personalized results (hashing done on CMS side) */
    userId?: string;
    /** Session hash for analytics tracking */
    sessionHash?: string;
    /** Called when a search is executed from the search box */
    onSearch?: (query: string) => void;
    /** Called when a result card is clicked */
    onResultClick?: (id: string, entityType?: string, position?: number) => void;
    /** Called when a page is changed */
    onPageChange?: (page: number) => void;
    /** Called when AI answer feedback is given (also auto-sends to backend) */
    onAiFeedback?: (answerHash: string, helpful: boolean) => void;
}
/**
 * Mount a TruSearch widget into a DOM element.
 *
 * @param type - Widget type: 'autocomplete' | 'search-page'
 * @param element - DOM element to render into
 * @param options - Widget configuration
 * @returns A controller to update options or unmount the widget
 */
declare function mount(type: 'autocomplete' | 'search-page', element: Element, options: AutocompleteMountOptions | SearchPageMountOptions): WidgetController | undefined;
/**
 * Unmount a previously mounted widget.
 */
declare function unmount(element: Element): void;

export { type AutocompleteClassNames, type AutocompletePanelConfig, type AutocompletePanelSection, type AutocompletePanelTheme, AutocompleteSuggestions, type FederatedSection, type FederatedSectionItem, type FederatedSuggestResponse, type FederatedSuggestion, SearchPageWidget, type SuggestItem, type SuggestResponse, type WidgetController, commandFetch, mount, unmount };
