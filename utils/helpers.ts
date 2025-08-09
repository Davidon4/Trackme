export const getURL = (path: string = '') => {
    // In production, always use NEXT_PUBLIC_SITE_URL
    if (process.env.NODE_ENV === 'production') {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.launchping.com';
      // Clean the base URL
      const cleanUrl = baseUrl
        .replace(/\/+$/, '')        // Remove trailing slashes
        .replace(/^@+/, '')         // Remove any @ symbols at the start
        .replace(/([^:]\/)\/+/g, '$1'); // Remove duplicate slashes

      // Ensure the URL has https:// if not already present
      const finalUrl = cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;
      
      // Clean the path
      const cleanPath = path.replace(/^\/+/, ''); // Remove leading slashes
      return cleanPath ? `${finalUrl}/${cleanPath}` : finalUrl;
    }

    // In development, fall back to other URLs
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXT_PUBLIC_APP_URL ||
      process.env.NEXT_PUBLIC_VERCEL_URL ||
      'http://localhost:3000';

    // Clean the base URL
    const cleanUrl = baseUrl
      .replace(/\/+$/, '')        // Remove trailing slashes
      .replace(/^@+/, '')         // Remove any @ symbols at the start
      .replace(/([^:]\/)\/+/g, '$1'); // Remove duplicate slashes

    // Add https:// if not localhost and not already having http(s)
    const finalUrl = cleanUrl.includes('localhost') 
      ? cleanUrl 
      : cleanUrl.startsWith('http') ? cleanUrl : `https://${cleanUrl}`;

    // Clean the path
    const cleanPath = path.replace(/^\/+/, '');
    return cleanPath ? `${finalUrl}/${cleanPath}` : finalUrl;
};

const toastKeyMap: { [key: string]: string[] } = {
  status: ['status', 'status_description'],
  error: ['error', 'error_description']
};

const getToastRedirect = (
  path: string,
  toastType: string,
  toastName: string,
  toastDescription: string = '',
  disableButton: boolean = false,
  arbitraryParams: string = ''
): string => {
  const [nameKey, descriptionKey] = toastKeyMap[toastType];

  let redirectPath = `${path}?${nameKey}=${encodeURIComponent(toastName)}`;

  if (toastDescription) {
    redirectPath += `&${descriptionKey}=${encodeURIComponent(toastDescription)}`;
  }

  if (disableButton) {
    redirectPath += `&disable_button=true`;
  }

  if (arbitraryParams) {
    redirectPath += `&${arbitraryParams}`;
  }

  return redirectPath;
};

export const getStatusRedirect = (
  path: string,
  statusName: string,
  statusDescription: string = '',
  disableButton: boolean = false,
  arbitraryParams: string = ''
) =>
  getToastRedirect(
    path,
    'status',
    statusName,
    statusDescription,
    disableButton,
    arbitraryParams
  );
  
export const getErrorRedirect = (
  path: string,
  errorName: string,
  errorDescription: string = '',
  disableButton: boolean = false,
  arbitraryParams: string = ''
) =>
  getToastRedirect(
    path,
    'error',
    errorName,
    errorDescription,
    disableButton,
    arbitraryParams
  );