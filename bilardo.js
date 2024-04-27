// Ball adında bir sınıf oluşturup içine constrcutor tanımladım.
//Simülasyonda topları temsil eden Ball sınıfı
class Ball {
  constructor(x, y, vx, vy, radius) {
    this.x = x; // x koordinatı // this ise objeyi temsil eder.
    this.y = y; // y koordinatı 
    this.vx = vx; // x bileşenli hız
    this.vy = vy; // y bileşenli hız
    this.radius = radius; // yarıçap
  }

  // Topu hareket ettiren metod move'dir. Move Css animate gibi davranır ve animasyonu sağlar.
  move() {
    this.x += this.vx; // x koordinatını güncelle
    this.y += this.vy; // y koordinatını güncelle
  }

  // 1- Duvarlarla çarpışmayı kontrol eden metod.Araştırmayla yaptım
  checkWallCollision(tableWidth, tableHeight) {
    // Sol ve sağ duvarlarla çarpışmayı kontrol et
    if (this.x - this.radius <= 0 || this.x + this.radius >= tableWidth) {
      this.vx *= -1; // x hızını tersine çevir
    }
    // Üst ve alt duvarlarla çarpışmayı kontrol et
    if (this.y - this.radius <= 0 || this.y + this.radius >= tableHeight) {
      this.vy *= -1; // y hızını tersine çevir
    }
  }
    /* Kodların Açıklaması */
  /* İlk olarak, sol ve sağ duvarlarla çarpışmayı kontrol eder. Eğer topun sol kenarı (x - yarıçap) tablonun sol kenarına eşit veya daha azsa, veya topun sağ kenarı (x + yarıçap) tablonun sağ kenarına eşit veya daha fazlaysa, bu durumda top duvara çarpmıştır. Bu durumda, topun x bileşenli hızı tersine çevrilir (this.vx *= -1;). Bu, topun duvara çarptıktan sonra yön değiştirmesini sağlar.
Daha sonra, üst ve alt duvarlarla çarpışmayı kontrol eder. Eğer topun üst kenarı (y - yarıçap) tablonun üst kenarına eşit veya daha azsa, veya topun alt kenarı (y + yarıçap) tablonun alt kenarına eşit veya daha fazlaysa, bu durumda top duvara çarpmıştır. Bu durumda, topun y bileşenli hızı tersine çevrilir (this.vy *= -1;). Bu da topun duvara çarptıktan sonra yön değiştirmesini sağlar.
Bu metod, topun tablonun duvarlarıyla çarpışmasını kontrol ederek, gerektiğinde topun hareket yönünü değiştirir ve böylece topun tablo içinde kalmasını sağlar. */

  // 2- Diğer toplarla çarpışmayı kontrol eden metod.Araştırmayla yaptım
  checkBallCollision(otherBall) {
    const dx = otherBall.x - this.x;
    const dy = otherBall.y - this.y;
    const distance = Math.sqrt(dx * dx + dy * dy);//mathematik metotları/ sqrt ile karekök

    if (distance < this.radius + otherBall.radius) {
      // Çarpışma açısını hesapla
      const angle = Math.atan2(dy, dx);
      const sin = Math.sin(angle);
      const cos = Math.cos(angle);

      // Hızları çarpışma açısı koordinatlarına dönüştür
      const vx1 = this.vx * cos + this.vy * sin;
      const vy1 = this.vy * cos - this.vx * sin;
      const vx2 = otherBall.vx * cos + otherBall.vy * sin;
      const vy2 = otherBall.vy * cos - otherBall.vx * sin;

      // Çarpışmadan sonra son hızları hesapla
      const finalVx1 = ((this.radius - otherBall.radius) * vx1 + (otherBall.radius + this.radius) * vx2) / (this.radius + otherBall.radius);
      const finalVx2 = ((otherBall.radius - this.radius) * vx2 + (this.radius + this.radius) * vx1) / (this.radius + otherBall.radius);

      // Hızları güncelle
      this.vx = finalVx1 * cos - vy1 * sin;
      this.vy = vy1 * cos + finalVx1 * sin;
      otherBall.vx = finalVx2 * cos - vy2 * sin;
      otherBall.vy = vy2 * cos + finalVx2 * sin;
    }
  }
}

 /* Kodların Açıklaması */
/* İki top arasındaki mesafe, iki topun merkezleri arasındaki mesafe hesaplanarak bulunur. Ardından, bu mesafe iki topun yarıçaplarının toplamıyla karşılaştırılır. Eğer bu mesafe, iki topun yarıçaplarının toplamından küçükse, bu durumda iki top birbirine çarpmış demektir.
Eğer iki top birbirine çarpıyorsa, çarpışma açısı hesaplanır. Bu, iki topun merkezleri arasındaki doğru açıyı ifade eder. Math.atan2 fonksiyonu kullanılarak çarpışma açısı hesaplanır.
Sonra, çarpışma açısına göre iki topun hızları yeniden hesaplanır. Bu hesaplama, elastik çarpışma prensiplerine dayanır. Hızlar, çarpışma açısına dönüştürülerek hesaplanır ve çarpışmadan sonra iki topun hızları güncellenir.
Bu metod, iki topun çarpışması durumunda, çarpışma sonrası yeni hızları hesaplar ve günceller. Bu şekilde, iki topun birbirine çarptıktan sonra doğru şekilde davranmasını sağlar. */

// Tablo boyutları ve top özellikleri
const table = {
  width: 500,
  height: 300
};

// Simülasyon için toplar oluşturdum, istenilen sayıda ve konumda top girilebilir başlangıç konumudur.
const balls = [
  new Ball(50, 50, 7, 1, 10), //sınıftan nesne türettim her top için ve konumları için, liste,dizi içine aldım.
  new Ball(150, 100, -1, -2, 15), /* + olarak topun içindeki son 3 değer x ve y yönündeki hızları ile yarıçaplar belirtilmiştir */
  new Ball(250, 150, -3, 4, 12),//toplar birbirine yakın geçerken çekim gücü uygulayıp birleşebiliyordı.
  new Ball(350, 200, 3, -5, 18),//bu yüzden herbir eksendeki hızını -,+ ve 0 değerler vererek yüzde 70 bunu engelledim
  new Ball(450, 250, 0, -7, 13),
  new Ball(10,10,5,6,12)
];


// Topları HTML konteynırına ekle ve konumlandır.foreach döngüsü ile 
balls.forEach((ball, index) => {
  const ballElement = document.createElement('div');//dinamik elemnt oluşturdum
  ballElement.className = 'ball';//'ball' adında class verdim
  ballElement.style.left = ball.x - ball.radius + 'px';//css özellikleri ile konum 
  ballElement.style.top = ball.y - ball.radius + 'px';
  document.getElementById('balls-container').appendChild(ballElement);//ıd değeri olan elemente yeni elementi ekledim.
});

// Simülasyonu güncelleyen fonksiyon,
function updateSimulation() {
  balls.forEach(ball => {
    ball.move(); // Topu hareket ettir
    ball.checkWallCollision(table.width, table.height); // Duvarlarla çarpışmayı kontrol et
  });

  // Toplar arasındaki çarpışmayı kontrol et,her biri birbirine çarpmasını sağlar.
  for (let i = 0; i < balls.length; i++) {
    for (let j = i + 1; j < balls.length; j++) {
      balls[i].checkBallCollision(balls[j]);
    }
  }


  /* Kodların Açıklaması */
 /*  /* Bu kod, toplar arasındaki çarpışmaları kontrol etmek için iç içe iki döngü kullanır.
  Dıştaki döngü, topların listesindeki her bir top için çalışır. İçteki döngü ise, dıştaki döngünün indeksinden bir sonraki toptan başlayarak listenin sonuna kadar çalışır. Bu şekilde, her bir top diğer tüm toplarla çarpışmayı kontrol eder, ancak her çift çarpışma yalnızca bir kere kontrol edilir.
  Örneğin, balls dizisinde 6 top ekledim.Dıştaki döngü, ilk top için başlar ve listenin ikinci elemanından başlayarak son elemana kadar ilerler. İçteki döngü, dıştaki döngünün indeksinden bir sonraki elemandan başlar ve listenin sonuna kadar ilerler. Bu şekilde, her bir top diğer tüm toplarla çarpışmayı kontrol eder, ancak her çift çarpışma yalnızca bir kez kontrol edilir.

  bu mantıkla, balls dizisindeki 6 top için iç içe döngülerin davranışı:

 1.top için iç döngü: 2., 3., 4., 5., 6. toplarla çarpışmayı kontrol eder.
 2.top için iç döngü: 3., 4., 5., 6. toplarla çarpışmayı kontrol eder.
 3.top için iç döngü: 4., 5., 6. toplarla çarpışmayı kontrol eder.
 4.top için iç döngü: 5., 6. toplarla çarpışmayı kontrol eder.
 5.top için iç döngü: 6. top ile çarpışmayı kontrol eder.
 6.top için iç döngü: Hiçbir çarpışma kontrol etmez çünkü listenin son elemanıdır.
  Bu şekilde, her bir top diğer tüm toplarla çarpışmayı kontrol eder, ancak her çift çarpışma yalnızca bir kez kontrol edilir.
 */







  // HTML konteynırındaki top pozisyonlarını güncelle
  balls.forEach((ball, index) => {
    const ballElement = document.querySelectorAll('.ball')[index];
    ballElement.style.left = ball.x - ball.radius + 'px';
    ballElement.style.top = ball.y - ball.radius + 'px';
  });
}


/* balls.forEach fonksiyonu kullanılarak, balls dizisindeki her bir top için bir döngü oluşturulur. Her döngü adımında, topun güncel pozisyonuna göre HTML içindeki ilgili top elementinin stilini güncellemek için gereken işlemler yapılır.

İlgili top elementi, document.querySelectorAll('.ball')[index] koduyla seç. Bu kod, HTML içindeki tüm ball sınıfındaki öğeleri seçer ve ardından bu öğelerin dizisinden ilgili topun indeksine göre doğru olanı seçer.

Seçilen top elementinin style.left ve style.top özellikleri(css özelliklerş), topun x ve y koordinatlarına göre ayarlanır. Bu, topun sol üst köşesi (topun merkezi değil) temel alınarak yapılır. Bu nedenle, ball.x - ball.radius ve ball.y - ball.radius değerleri kullanılır. ball.radius değeri, topun yarıçapını temsil eder ve bu, topun merkezinden sol üst köşesine olan mesafeyi temsil eder.

Bu kodlar sayesinde, her bir topun HTML içindeki görünsü güncellenr ve kullanıcıya,tarayıcıda topların güncel konumları görsel olarak gösterilir. */

// Simülasyonu güncellemek için aralık ayarladım
const interval = setInterval(updateSimulation, 50); // Her 50 milisaniyede bir güncelle








/* Her bir topun farklı başlangıç konumları, hızları ve yarıçapları bulunmaktadır. 
Kod, HTML dosyasında tanımlanan bir konteynıra topları yerleştirir ve 
her bir topun pozisyonunu düzenli aralıklarla güncelleyerek simülasyonu gerçekleştirir. */