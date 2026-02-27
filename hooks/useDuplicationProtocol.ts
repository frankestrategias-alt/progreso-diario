import { useState, useEffect } from 'react';
import { UserGoals } from '../types';
import { deserializeGoals } from '../services/duplicationService';

export function useDuplicationProtocol() {
    const [incomingGoals, setIncomingGoals] = useState<UserGoals | null>(() => {
        const params = new URLSearchParams(window.location.search);
        const hashPart = window.location.hash.includes('?') ? window.location.hash.split('?')[1] : '';
        const hashParams = new URLSearchParams(hashPart);
        const dupParam = params.get('dup') || hashParams.get('dup');

        if (dupParam) {
            console.log('📡 Protocolo de Duplicación detectado...');
            const decoded = deserializeGoals(dupParam);
            if (decoded) {
                console.log('✅ Visión de Líder cargada:', decoded.companyName);
                return decoded;
            }
        }
        return null;
    });

    useEffect(() => {
        // Clean URL if we detected a duplication link on init
        if (incomingGoals) {
            const newUrl = window.location.origin + window.location.pathname + window.location.hash.split('?')[0];
            window.history.replaceState({}, '', newUrl);
        }
    }, [incomingGoals]);

    return { incomingGoals, setIncomingGoals };
}
