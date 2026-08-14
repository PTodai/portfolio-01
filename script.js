/**
 * DAI / WEB DESIGNER - ポートフォリオサイト用スクリプト
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================
  // 1. スクロール時のヘッダー背景変更
  // ==========================================
  const header = document.getElementById('header');
  
  // スクロール量を監視してヘッダーの表示を切り替える関数
  const handleScroll = () => {
    // 50px以上スクロールされたらヘッダーに「scrolled」クラスを追加する
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // スクロールイベントが発生するたびにhandleScrollを実行
  window.addEventListener('scroll', handleScroll);
  // 初回読み込み時にも状態を判定
  handleScroll();


  // ==========================================
  // 2. モバイルナビゲーション (ハンバーガーメニュー)
  // ==========================================
  const menuToggle = document.getElementById('menu-toggle');
  const navMobile = document.getElementById('nav-mobile');
  const mobileLinks = document.querySelectorAll('.nav-mobile-link');

  // メニューを開閉する関数
  const toggleMenu = () => {
    const isOpen = navMobile.classList.toggle('is-open');
    menuToggle.classList.toggle('is-active');
    
    // メニューが開いているときは背後のメインコンテンツをスクロール不可にする（UX向上）
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  };

  // ハンバーガーボタンをクリックしたときのイベント登録
  menuToggle.addEventListener('click', toggleMenu);

  // モバイルメニュー内のリンクをクリックしたときはメニューを閉じる
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMobile.classList.contains('is-open')) {
        toggleMenu();
      }
    });
  });

  // 画面幅がリサイズされてPCサイズになった時にモバイルメニューが開いていれば閉じる
  window.addEventListener('resize', () => {
    if (window.innerWidth >= 768 && navMobile.classList.contains('is-open')) {
      toggleMenu();
    }
  });


  // ==========================================
  // 3. スムーススクロール (滑らかなページ内遷移)
  // ==========================================
  const allLinks = document.querySelectorAll('a[href^="#"]');

  allLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      
      // hrefが "#" だけの場合はトップへ戻る
      if (href === '#') {
        e.preventDefault();
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });
        return;
      }
      
      // リンク先のターゲット要素を取得
      const targetElement = document.querySelector(href);
      if (targetElement) {
        e.preventDefault(); // デフォルトの瞬間的なジャンプ動作をキャンセル
        
        // ヘッダーが固定（Fixed）されているため、その高さ分を引いてスクロール位置を調整
        const headerHeight = header.offsetHeight;
        const targetPosition = targetElement.offsetTop - headerHeight;
        
        // 滑らかにスクロールを実行
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });


  // ==========================================
  // 4. スクロール時のフェードインアニメーション
  //    (IntersectionObserverの利用)
  // ==========================================
  // ※IntersectionObserver（インターセクション・オブザーバー）とは：
  // 特定の要素がブラウザの表示領域（画面内）に入ってきたかどうかを検知する最新のAPIです。
  // 従来のスクロールイベント監視に比べて動作が非常に軽量で、パフォーマンスに優れています。
  
  const fadeElements = document.querySelectorAll('.fade-in');

  // 要素が視界に入ったときの処理を定義
  const fadeObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      // 要素が画面内に入った場合（isIntersecting が true のとき）
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible'); // CSSで定義した不透明化クラスを適用
        observer.unobserve(entry.target); // 一度アニメーションしたら監視を解除して負荷を減らす
      }
    });
  }, {
    // 監視オプション設定
    root: null,          // ビューポート（ブラウザ画面）を基準にする
    rootMargin: '0px 0px -80px 0px', // 画面下部から80px内側に入った段階でアニメーションをトリガーする
    threshold: 0.15      // 対象要素が15%以上見えたら実行
  });

  // 対象となるすべてのフェードイン要素を監視対象に登録
  fadeElements.forEach(element => {
    fadeObserver.observe(element);
  });

});
