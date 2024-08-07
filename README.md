프로젝트 실행 가이드
이 프로젝트는 웹에서 3D 파일을 간편하게 업로드하고, 시각화하며, 캡처할 수 있는 기능을 제공합니다.

<h2> 3D 파일 확장자 </h1>
<p>DAE / FBX (잔버그가 많음) /GLB / OBJ / PCD / PLY /STL /TDS </ p>

<h2> 3D 파일 업로드 </h2>
<p> 단일 파일 업로드</p>
<p> 다중 파일 업로드</p>
<p> 단일 폴더 업로드</p>
<p> ZIP 파일 업로드</p>

업로드는 단일 파일, 다중 파일, 단일 폴더, 그리고 ZIP 파일을 통해 가능합니다. ZIP 파일 기능은 현재 구현 예정입니다.
1. 파일 업로드
왼쪽 컨트롤 패널의 웹 뷰어를 통해 파일, 폴더, 또는 ZIP 파일을 업로드합니다. <br />
![ThreeD_FirstCircle](https://github.com/user-attachments/assets/11bd2a17-9b5d-41d5-8181-96ec4a919949)

2. 파일 선택 및 3D 오브젝트 보기
업로드한 파일은 그룹별로 정리되어 리스트에 표시됩니다. 리스트에서 항목을 클릭합니다. <br />
![ThreeD_SecondCircle](https://github.com/user-attachments/assets/bf1ed650-e387-441b-98af-4218f6c7db51)
![ThreeD_ThirdCircle](https://github.com/user-attachments/assets/022c795b-5aef-4682-9535-f109c34c2731)

3. 해당 항목의 3D 오브젝트가 ModelViewer.jsx로 전달되어 3D 뷰어에서 시각화됩니다.


4. 조정 및 캡처
왼쪽 컨트롤 패널에서 조명 값과 배경화면을 설정합니다. 설정이 완료되면, 캡처 버튼을 클릭하여 현재 3D 뷰를 캡처합니다.

5. 미리보기 및 저장
캡처된 이미지는 오른쪽의 Preview.jsx로 전달되어 미리보기 됩니다. 캡처한 이미지는 3D 파일의 이름과 .jpg 확장자를 가진 파일로 자동 저장됩니다.
![ThreeD_1 (1)](https://github.com/user-attachments/assets/966ea62b-9c9b-49c2-8675-9870593a9da9)
