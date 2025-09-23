export const formatPrice = (price: number, decimals: number = 2): string => {
  return `₹${price.toLocaleString('en-IN', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
};

export const formatChange = (change: number, decimals: number = 2): string => {
  const sign = change >= 0 ? '+' : '';
  return `${sign}${change.toFixed(decimals)}`;
};

export const formatPercentage = (percentage: number, decimals: number = 2): string => {
  const sign = percentage >= 0 ? '+' : '';
  return `${sign}${percentage.toFixed(decimals)}%`;
};

export const formatVolume = (volume: number): string => {
  if (volume >= 10000000) {
    return `${(volume / 10000000).toFixed(1)}Cr`;
  } else if (volume >= 100000) {
    return `${(volume / 100000).toFixed(1)}L`;
  } else if (volume >= 1000) {
    return `${(volume / 1000).toFixed(1)}K`;
  }
  return volume.toString();
};

export const getPriceColorClass = (change: number): string => {
  if (change > 0) return 'price-up';
  if (change < 0) return 'price-down';
  return 'price-neutral';
};

export const formatTime = (timestamp: string | number): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const formatDateTime = (timestamp: string | number): string => {
  const date = typeof timestamp === 'string' ? new Date(timestamp) : new Date(timestamp * 1000);
  return date.toLocaleString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const isMarketOpen = (): boolean => {
  const now = new Date();
  const day = now.getDay(); // 0 = Sunday, 6 = Saturday
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTime = hour * 60 + minute;

  // Market is closed on weekends
  if (day === 0 || day === 6) return false;

  // Market hours: 9:15 AM to 3:30 PM
  const marketOpen = 9 * 60 + 15; // 9:15 AM
  const marketClose = 15 * 60 + 30; // 3:30 PM

  return currentTime >= marketOpen && currentTime <= marketClose;
};

export const getMarketStatus = (): 'Open' | 'Closed' | 'Pre-Market' | 'Post-Market' => {
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const currentTime = hour * 60 + minute;

  // Weekend
  if (day === 0 || day === 6) return 'Closed';

  const marketOpen = 9 * 60 + 15; // 9:15 AM
  const marketClose = 15 * 60 + 30; // 3:30 PM
  const preMarketStart = 9 * 60; // 9:00 AM

  if (currentTime >= marketOpen && currentTime <= marketClose) {
    return 'Open';
  } else if (currentTime >= preMarketStart && currentTime < marketOpen) {
    return 'Pre-Market';
  } else if (currentTime > marketClose && currentTime < 24 * 60) {
    return 'Post-Market';
  } else {
    return 'Closed';
  }
};