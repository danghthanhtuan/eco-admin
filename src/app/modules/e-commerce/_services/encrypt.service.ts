import { Injectable, OnInit, inject } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import * as Forge from 'node-forge';

@Injectable({
    providedIn: 'root',
})
export class EncryptService implements OnInit {
    public publicKey: string = `-----BEGIN PUBLIC KEY-----
MIIBITANBgkqhkiG9w0BAQEFAAOCAQ4AMIIBCQKCAQB6FveBG+ZhfKJCbb2pQO08
XfOLuLnxG3JuabXtxM1u+5FgzRIiS1G6OVsVkzLUfy/Rr6BqbKK9dw9GeUMOx/1r
jDiyZZdA3CFNxZgGqNH2vS+aCmiSWXpl/2nSq7JN9eW0NjiiSXZl4Rd2ukP2szAB
TknnXuBMXYBEvTK33b0iCyrGo1ZQOwXwb4DSoHKvzolmhSlAIYhSh/YpZQG/vq8j
uxSuYJO2PVExyiyN7kF4CAlm0RSIkZk3CfX2LQgJHy6R2hrH8u4nu07C1xiBlX8a
i7U8ty2IA4+aWOcgcdAngoH3M+He06ZF69gDC3zG5xKeNxCnqUbmWMl+AHOBgfZJ
AgMBAAE=
-----END PUBLIC KEY-----`;

    constructor() {
    }

    ngOnInit(): void {
    }

    encrypt(data: string): string {
        let random = this.randomString(16);
        var res = {
            HashKey: this.encryptUsingRSA(random),
            HashData: this.encryptUsingAES(data, random),
        };
        return JSON.stringify(res);
    }

    encryptNoStringfy(data: string): any {
        let random = this.randomString(16);
        var res = {
            HashKey: this.encryptUsingRSA(random),
            HashData: this.encryptUsingAES(data, random),
        };
        return (res);
    }

    encryptUsingRSA(keyRandom: string) {
        const publickKey = Forge.pki.publicKeyFromPem(this.publicKey);
        var encrypted = publickKey.encrypt(Forge.util.encodeUtf8(keyRandom));
        return btoa(encrypted.toString());
    }

    encryptUsingAES(data: string, keyRandom: string): any {
        var text = data;
        var key = Forge.util.encodeUtf8(keyRandom);
        var encrypted = CryptoJS.AES.encrypt(text, this.toWordArray(key),
            {
                keySize: 16,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7,
                iv: this.toWordArray(key)
            });
        var encrypted2 = this.toBase64String(encrypted.ciphertext);
        return encrypted2;
    }

    toWordArray(str: string) {
        return CryptoJS.enc.Utf8.parse(str);
    }

    toBase64String(words: any) {
        return CryptoJS.enc.Base64.stringify(words);
    }

    randomString(length: number) {
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        var result = '';
        for (var i = 0; i < length; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        return (result);
    }
}