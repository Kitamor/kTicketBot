<div align="center">
  <img src="figures/logo.png" width="60%" alt="kTicketBot" />
</div>
<hr>

kTicketBot, Discord sunucunuz için gelişmiş ve özelleştirilebilir bir destek talebi (ticket) botudur. Müşterilerinizle profesyonel bir şekilde iletişim kurmanızı ve destek ekibinizi yönetmenizi sağlar.

## 🚀 Özellikler

kTicketBot, standart bir ticket botundan çok daha fazlasını sunar:

- **Çoklu Dil Desteği:** Tüm mesajlar ve butonlar hem Türkçe hem de İngilizce olarak ayarlanabilir.
- **Esnek Yapılandırma:** `config.js` dosyası üzerinden her şeyi kendi isteğinize göre özelleştirebilirsiniz.
- **Kategori Seçimi:** Talepleri kategorize etmek için buton veya menü kullanabilirsiniz.
- **Yetkili Atama Sistemi:** Yetkililer talepleri üzerlerine alabilir, böylece kimin hangi taleple ilgilendiği belli olur.
- **Gelişmiş Sıralama Sistemi:** Yetkililerin performansını (yardım edilen talep sayısı, mesaj sayısı, ortalama puan) takip edebilirsiniz.
- **Transcript (Kayıt) Sistemi:** Kapatılan taleplerin geçmişini "transcripts" klasörüne HTML olarak kaydeder ve log kanalına gönderir.
- **Anket Sistemi:** Kullanıcı ilk kez talep açmadan önce "Bizi nereden duydunuz?" gibi anket soruları sorulabilir.
- **Karaliste (Blacklist) Sistemi:** İstediğiniz kullanıcıların talep açmasını engelleyebilirsiniz.
- **Sunucudan Ayrılma Takibi:** Kullanıcı sunucudan ayrıldığında talebi otomatik kapanır, geri döndüğünde yeniden açma butonu gönderilir.
- **Özel Komutlar:** Belirlediğiniz prefix (ön ek) ile özel hızlı yanıt komutları oluşturabilirsiniz.

## 🛠️ Kurulum

Botu kurmak için aşağıdaki adımları izleyin:

1. **Gereksinimler:**
   - [Node.js](https://nodejs.org/) (Sürüm `v18.20.6` önerilir).
   - Discord Bot Tokenı.

2. **Dosyaları İndirin:**
   Projeyi indirin ve bir klasöre çıkartın.

3. **Bağımlılıkları Kurun:**
   Terminali veya komut istemcisini (CMD) proje klasöründe açın ve şu komutu çalıştırın:
   ```bash
   npm install
   ```

4. **Yapılandırma:**
   `config.js` dosyasını bir metin düzenleyici (VS Code, Not Defteri vb.) ile açın:
   - `token`: Botunuzun tokenını buraya yazın.
   - `guildId`: Sunucunuzun ID'sini yazın.
   - `owners`: Bot sahibi olan kullanıcıların ID'lerini dizi şeklinde ekleyin.
   - Diğer ayarları ihtiyacınıza göre düzenleyin.

5. **Botu Çalıştırın:**
   `start.bat` dosyasını çalıştırın veya terminale şu komutu yazın:
   ```bash
   node index.js
   ```

## 📢 Kullanım ve Kurulum Komutu

Bot çalıştıktan sonra sunucunuzda kurulumu tamamlamak için:

1. Sunucuda bir yetkili (owner listesindeki biri) olarak istediğiniz bir kanala gidin.
2. Aşağıdaki komutu kullanarak ticket açma mesajını gönderin:
   ```text
   !setup tr
   ```
   *(İngilizce kurulum için `!setup en-US` komutunu kullanabilirsiniz.)*

3. Bot, belirttiğiniz dilde şık bir embed mesajı ve ticket açma butonu gönderecektir.

## 📄 Lisans

Bu proje [MIT Lisansı](LICENSE) altında lisanslanmıştır.

---
**Daha fazla destek için:** [Discord Sunucumuz](https://discord.gg/7S8y9ntrbe)
