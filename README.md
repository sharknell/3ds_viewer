<h1>프로젝트 실행 가이드</h1>
        <hr />
        <img src="https://img.shields.io/badge/threejs-black?style=for-the-badge&logo=three.js&logoColor=white" alt="Threejs" class="badge" />
        <img src="https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB" alt="React" class="badge" />
        <img src="https://img.shields.io/badge/netlify-%23000000.svg?style=for-the-badge&logo=netlify&logoColor=#00C7B7" alt="Netlify" class="badge" />
        <p>이 프로젝트는 웹에서 3D 파일을 간편하게 업로드하고, 시각화하며, 캡처할 수 있는 기능을 제공합니다.</p>
이 프로젝트는 웹에서 3D 파일을 간편하게 업로드하고, 시각화하며, 캡처할 수 있는 기능을 제공합니다.
<h2> 3D 파일 확장자 </h1> 
<p>DAE / FBX (잔버그가 많음) /GLB / OBJ / PCD / PLY /STL /TDS </ p>

<h2> 3D 파일 업로드 </h2>
<b> 단일 파일 업로드 ||
 다중 파일 업로드 || 
 단일 폴더 업로드 || 
ZIP 파일 업로드</b>

1. 파일 업로드
왼쪽 컨트롤 패널의 웹 뷰어를 통해 파일, 폴더, 또는 ZIP 파일을 업로드합니다. <br>
![ThreeD_FirstCircle](https://github.com/user-attachments/assets/11bd2a17-9b5d-41d5-8181-96ec4a919949)


2. 파일 선택 및 3D 오브젝트 보기
업로드한 파일은 그룹별로 정리되어 리스트에 표시됩니다. 리스트에서 항목을 클릭합니다. <br />
![ThreeD_SecondCircle](https://github.com/user-attachments/assets/bf1ed650-e387-441b-98af-4218f6c7db51)


3. 해당 항목의 3D 오브젝트가 <code>ModelViewer.jsx</code>로 전달되어 3D 뷰어에서 시각화됩니다.
![ThreeD_ThirdCircle](https://github.com/user-attachments/assets/022c795b-5aef-4682-9535-f109c34c2731)

4. 조정 및 캡처
왼쪽 컨트롤 패널에서 조명 값과 배경화면을 설정합니다. 설정이 완료되면, 캡처 버튼을 클릭하여 현재 3D 뷰를 캡처합니다.

<h2>5. 미리보기 및 저장</h2>
캡처된 이미지는 오른쪽의 <code>Preview.jsx</code>로 전달되어 미리보기 됩니다. 캡처한 이미지는 3D 파일의 이름과 <code>.jpg</code> 확장자를 가진 파일로 자동 저장됩니다. <br />

![ThreeD_FiveCircle](https://github.com/user-attachments/assets/1ef215cd-2efd-4f68-acc9-e0e2f209008f) 

![ThreeD_FourCircle](https://github.com/user-attachments/assets/99c8b968-164b-4df9-981e-9c01d7738757)


 <h2>Demo</h2>
  <p>프로젝트의 데모를 확인하려면 <a href="https://three3d-viewer.netlify.app/" target="_blank">여기</a>를 클릭하세요.</p>
