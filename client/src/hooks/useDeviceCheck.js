import { useState, useEffect } from 'react';
export const useDeviceCheck = () => {
    const [deviceInfo, setDeviceInfo] = useState({
        isMobile: false,
        isTablet: false,
        isDesktop: true,
        deviceType: 'desktop',
        os: 'unknown',
        browser: 'unknown',
        screenWidth: typeof window !== 'undefined' ? window.innerWidth : 0,
        screenHeight: typeof window !== 'undefined' ? window.innerHeight : 0,
        isTouchDevice: false,
        isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    });
    useEffect(() => {
        const detectDevice = () => {
            const userAgent = navigator.userAgent.toLowerCase();
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;
            // Detect device type
            const isMobile = /mobile|android|iphone|ipod|windows phone/.test(userAgent);
            const isTablet = /ipad|android|tablet|kindle|playbook|silk|nexus|xoom/.test(userAgent) &&
                !isMobile;
            const isDesktop = !isMobile && !isTablet;
            // Detect OS
            let os = 'unknown';
            if (/iphone|ipad|ipod|ios/.test(userAgent))
                os = 'ios';
            else if (/android/.test(userAgent))
                os = 'android';
            else if (/windows|win32/.test(userAgent))
                os = 'windows';
            else if (/macintosh|mac os x/.test(userAgent))
                os = 'macos';
            else if (/linux/.test(userAgent))
                os = 'linux';
            // Detect browser
            let browser = 'unknown';
            if (/chrome|chromium|crios/.test(userAgent))
                browser = 'Chrome';
            else if (/safari/.test(userAgent) && !/chrome/.test(userAgent))
                browser = 'Safari';
            else if (/firefox/.test(userAgent))
                browser = 'Firefox';
            else if (/msie|trident/.test(userAgent))
                browser = 'Internet Explorer';
            else if (/edge|edg\//.test(userAgent))
                browser = 'Edge';
            else if (/opera|opr\//.test(userAgent))
                browser = 'Opera';
            // Check if touch device
            const isTouchDevice = typeof window !== 'undefined' &&
                (navigator.maxTouchPoints > 0 ||
                    // @ts-ignore
                    navigator.msMaxTouchPoints > 0 ||
                    'ontouchstart' in window);
            setDeviceInfo({
                isMobile,
                isTablet,
                isDesktop,
                deviceType: isDesktop ? 'desktop' : isMobile ? 'mobile' : 'tablet',
                os,
                browser,
                screenWidth,
                screenHeight,
                isTouchDevice,
                isOnline: navigator.onLine,
            });
        };
        detectDevice();
        // Handle window resize
        window.addEventListener('resize', detectDevice);
        // Handle online/offline status
        const handleOnline = () => {
            setDeviceInfo((prev) => ({ ...prev, isOnline: true }));
        };
        const handleOffline = () => {
            setDeviceInfo((prev) => ({ ...prev, isOnline: false }));
        };
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        return () => {
            window.removeEventListener('resize', detectDevice);
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);
    return deviceInfo;
};
