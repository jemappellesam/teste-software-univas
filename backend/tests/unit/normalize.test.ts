import { describe, it, expect } from 'vitest';
import { normalizeName } from '../../src/utils/normalize';

describe('normalizeName', ()=>{
    it('validar nome inserido inteiramente como maiúsculo',()=>{
        expect(normalizeName("SAMUEL")).toBe("samuel")
    })
})