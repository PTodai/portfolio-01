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


  // ==========================================
  // 5. お問い合わせフォームの送信処理 (Web3Forms APIによる非同期通信)
  // ==========================================
  // ※非同期通信（Ajax/Fetch API）とは：
  // ページをリロード（再読み込み）することなく、裏側でサーバーとデータをやり取りする技術です。
  // 送信ボタンを押した後に画面が白くならず、スムーズに「送信完了」のメッセージを表示できます。
  
  const contactForm = document.getElementById('contact-form');
  const submitBtn = contactForm ? contactForm.querySelector('.submit-btn') : null;
  const submitBtnText = submitBtn ? submitBtn.querySelector('span') : null;

  if (contactForm && submitBtn && submitBtnText) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault(); // 通常のブラウザのフォーム送信（ページ遷移）を防止します

      // アクセス用のキーが初期値（プレースホルダー）のままになっていないか確認します
      const accessKeyInput = contactForm.querySelector('input[name="access_key"]');
      if (accessKeyInput && (accessKeyInput.value === 'YOUR_ACCESS_KEY_HERE' || accessKeyInput.value === '')) {
        alert('メール送信を有効にするには、HTML内の「YOUR_ACCESS_KEY_HERE」を取得したアクセスキーに書き換える必要があります。');
        return;
      }

      // 送信中であることが伝わるよう、ボタンをクリック不可にしテキストを変更します
      submitBtn.disabled = true;
      const originalText = submitBtnText.textContent;
      submitBtnText.textContent = 'Sending... (送信中)';

      // フォームに入力されたデータを収集します
      const formData = new FormData(contactForm);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      // Web3FormsのAPIサーバーに対してデータを送信（Fetch）します
      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      })
      .then(async (response) => {
        let jsonResponse = await response.json();
        if (response.status == 200) {
          // 送信成功時：ボタンの文言を変えてユーザーに通知し、入力をクリアします
          submitBtnText.textContent = 'Sent Successfully! (送信完了)';
          alert('お問い合わせ内容を送信しました。指定のメールアドレスに届きます。');
          contactForm.reset(); // 入力フォームを空に戻します
        } else {
          // サーバー側でエラーが返ってきた場合
          console.log(response);
          submitBtnText.textContent = 'Error (送信失敗)';
          alert('送信に失敗しました: ' + jsonResponse.message);
        }
      })
      .catch(error => {
        // ネットワークが切断されているなどのエラー時
        console.log(error);
        submitBtnText.textContent = 'Network Error';
        alert('ネットワーク接続エラーが発生しました。接続を確認してください。');
      })
      .then(() => {
        // 送信処理（成功・失敗問わず）が完了したら、3秒後にボタンの状態を元に戻します
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtnText.textContent = originalText;
        }, 3000);
      });
    });
  }

});
