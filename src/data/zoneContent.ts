import type { ZoneStory } from '../types';

/**
 * Nội dung giới thiệu / kỷ niệm cho từng khu vực (Phần 1 của sổ lưu niệm).
 * Bạn có thể sửa trực tiếp văn bản ở đây để phù hợp với ký ức thật của mình.
 */
export const ZONE_STORIES: Record<string, ZoneStory> = {
  san_khau: {
    tagline: 'Nơi tiếng nhạc mở đầu mỗi mùa lễ hội.',
    accent: '#3763f4',
    paragraphs: [
      'Sân khấu nhỏ nằm ở đầu khuôn viên trường, là nơi mỗi năm đón chào học sinh mới bằng lễ khai giảng rộn ràng. Dưới cái nắng đầu thu và ánh đèn sân khấu, tiếng trống trường vang lên, thầy cô và cả trường cùng hát vang bài hát truyền thống.',
      'Đây cũng là nơi những tiết mục văn nghệ 20/11, "Xuân yêu thương" hay đêm tri ân ra đời. Có bạn lần đầu đứng trên sân khấu run đến quên lời, vậy mà sau hôm ấy lại trở thành "cây văn nghệ" của lớp, cứ đến mùa lễ là cả trường lại nhắc tên.',
    ],
    highlights: [
      'Lễ khai giảng và tiếng trống tựu trường',
      'Những tiết mục văn nghệ 20/11',
      'Đêm tri ân, lời chào tạm biệt tuổi học trò',
    ],
  },
  san_SH: {
    tagline: 'Sân sinh hoạt – nơi cả trường xếp hàng mỗi sáng thứ Hai.',
    accent: '#0e7490',
    paragraphs: [
      'Mỗi sáng thứ Hai, từng lớp xếp thành hàng ngay ngắn trên sân sinh hoạt. Tiếng trống chào cờ, lá quốc kỳ từ từ kéo lên và cả sân trường im phăng phắc, chỉ còn tiếng gió và tiếng Quốc ca vang theo loa phát thanh.',
      'Sau nghi lễ là phần sinh hoạt dưới cờ: thông báo thi đua, nhắc lịch thi, khiển trách nhẹ nhàng những bạn đi trễ và tuyên dương những tập thể sạch đẹp. Đứng dưới nắng, đứa nào cũng mong phần này kết thúc nhanh để còn kịp về lớp.',
    ],
    highlights: [
      'Chào cờ sáng thứ Hai',
      'Sinh hoạt dưới cờ và thông báo thi đua',
      'Những lần đứng cuối hàng trốn nắng',
    ],
  },
  can_tin: {
    tagline: 'Góc nhỏ cứu đói mọi giờ ra chơi.',
    accent: '#b45309',
    paragraphs: [
      'Căn tin nằm ngay lối vào, lúc nào cũng thơm mùi bánh mì nướng và trà sữa. Giờ ra chơi chỉ mười lăm phút mà hàng người xếp dài, tiếng gọi nhau í ới: "Lấy giùm tao ổ bánh mì!", "Cho tao thêm đá!"…',
      'Bàn ghế trong căn tin là nơi diễn ra đủ thứ chuyện: chép bài, chia nhau gói snack, bàn kế hoạch đi sinh nhật, và cả những lần "họp bí mật" để chuẩn bị quà cho cô giáo chủ nhiệm. Đồ ăn có thể hết, nhưng kỷ niệm thì còn mãi.',
    ],
    highlights: [
      'Bánh mì, trà sữa và những món ăn vặt tuổi học trò',
      'Xếp hàng mua đồ ăn trong giờ ra chơi',
      'Bàn căn tin – "phòng họp" bí mật của lớp',
    ],
  },
  day_lop_hoc_toa_a: {
    tagline: 'Dãy phòng học với những ô cửa sổ nhìn ra sân trường.',
    accent: '#1d4ed8',
    paragraphs: [
      'Toà A là dãy lớp học quen thuộc với hành lang dài, mỗi lớp một cánh cửa xanh và tấm bảng đen luôn còn vệt phấn. Buổi sáng nắng xiên qua ô cửa sổ, rơi thành từng vệt sáng trên mặt bàn gỗ.',
      'Trong những lớp học ấy có tiếng giảng bài đều đều, có tiếng đồng hồ tích tắc trước giờ kiểm tra, có chỗ ngồi cuối lớp mà đứa nào cũng tranh nhau. Ngày cuối cấp, cả lớp quay lại đứng trước cửa lớp mình, chụp một tấm ảnh mà ai cũng cười thật tươi.',
    ],
    highlights: [
      'Bảng đen, phấn trắng và những giờ kiểm tra',
      'Chỗ ngồi quen thuộc bên ô cửa sổ',
      'Ngày cuối cấp trước cửa lớp',
    ],
  },
  day_lop_hoc_toa_b: {
    tagline: 'Nơi những giờ học và cả những giấc ngủ trưa trốn cô cùng tồn tại.',
    accent: '#6d28d9',
    paragraphs: [
      'Toà B nằm phía bên kia sân, là dãy lớp học của những năm tháng cuối cấp. Hành lang toà B được các bạn học sinh "ưu ái" gọi là con đường ngắn nhất để chạy xuống căn tin, cũng là nơi trú mưa quen thuộc mỗi chiều.',
      'Giờ học ở đây có những tiếng cười không nhịn được, những lần cả lớp im lặng khi cô giáo bước vào, và những buổi ôn thi mà bảng đen kín đặc công thức. Ra trường rồi, nhìn lại dãy hành lang ấy, tự nhiên thấy nhớ cả những tiết học từng nghĩ là dài lê thê.',
    ],
    highlights: [
      'Hành lang trú mưa và chạy xuống căn tin',
      'Những buổi ôn thi kín bảng công thức',
      'Tiếng cười trong lớp những ngày cuối cấp',
    ],
  },
  bang_vinh_danh_thong_bao: {
    tagline: 'Nơi lưu tên những gương mặt làm trường tự hào.',
    accent: '#166534',
    paragraphs: [
      'Tấm bảng lớn nằm ngay lối đi chính, mỗi tuần lại được dán thêm giấy thông báo mới: lịch thi, kế hoạch sinh hoạt, danh sách học sinh giỏi và cả những tấm giấy khen đỏ thắm.',
      'Có những bạn đi ngang chỉ để tìm tên mình trong danh sách, rồi lặng lẽ mỉm cười. Có những lần cả trường đứng lại đọc thông báo hoãn học, nghỉ lễ, và vui nhất là khi thấy tên lớp mình trong bảng thi đua tuần này.',
    ],
    highlights: [
      'Tấm giấy khen đỏ thắm mang tên mình',
      'Thông báo lịch thi và nghỉ lễ',
      'Bảng thi đua tuần của các lớp',
    ],
  },
  ban_ghe_da: {
    tagline: 'Chiếc ghế đá mát rượi dưới tán cây, nơi mọi câu chuyện bắt đầu.',
    accent: '#0f766e',
    paragraphs: [
      'Những chiếc ghế đá nằm rải rác trong sân trường, chẳng biết có từ bao giờ, chỉ biết chỗ nào có bóng cây là chỗ đó có ghế. Giờ ra chơi, ghế đá là "văn phòng" của hội bạn thân: đứa ôn bài, đứa ăn vặt, đứa ngồi ngắm sân trường.',
      'Mùa thi đến, ghế đá chật kín người, ai cũng cầm tập đề cương. Chiều muộn, nắng đã dịu, tiếng ve kêu râm ran, có đứa ngồi im lặng rất lâu chỉ để nhìn sân trường một lần nữa trước khi chia tay.',
    ],
    highlights: [
      'Giờ ra chơi bên ghế đá',
      'Ôn bài mùa thi dưới bóng cây',
      'Những câu chuyện "chỉ hai đứa mới hiểu"',
    ],
  },
  cot_co: {
    tagline: 'Cột cờ sừng sững giữa sân – nhịp tim của những buổi chào cờ.',
    accent: '#b91c1c',
    paragraphs: [
      'Cột cờ đứng giữa sân, cao vút và luôn là điểm nhìn đầu tiên khi bước vào trường. Mỗi sáng thứ Hai, đội nghi thức chỉnh lại hàng, tiếng hô "Chào cờ – Chào!" vang lên và cả sân trường cùng đứng nghiêm.',
      'Lá cờ đỏ tung bay trong gió, phía dưới là những gương mặt non trẻ ngước lên. Nhiều năm sau, mỗi lần nghe lại Quốc ca, người ta vẫn nhớ cảm giác đứng dưới cột cờ ấy, tay thẳng, mắt nhìn lá cờ, lòng bỗng thấy mình lớn hơn một chút.',
    ],
    highlights: [
      'Lễ chào cờ và đội nghi thức',
      'Lá cờ đỏ tung bay trong gió sớm',
      'Cảm giác nghiêm trang mỗi sáng thứ Hai',
    ],
  },
  xich_du: {
    tagline: 'Hai chiếc xích đu nhỏ, một thời tranh nhau đến mức cô phải nhắc.',
    accent: '#0369a1',
    paragraphs: [
      'Khu xích đu nằm khuất sau dãy lớp học, ít người qua lại nên càng được các bạn "săn đón". Giờ ra chơi, ai nhanh chân thì được ngồi, người đến sau đứng đẩy và cùng cười vang cả một góc sân.',
      'Có những buổi chiều tan học muộn, xích đu vắng người, chỉ có tiếng kẽo kẹt đều đều và tiếng lá xào xạc. Ngồi đó, đung đưa chậm rãi, tự nhiên thấy mọi lo lắng về bài kiểm tra ngày mai nhẹ đi một nửa.',
    ],
    highlights: [
      'Tranh nhau xích đu mỗi giờ ra chơi',
      'Tiếng kẽo kẹt và bóng lá chiều muộn',
      'Những phút bình yên sau giờ tan học',
    ],
  },
  day_chuc_nang: {
    tagline: 'Dãy phòng thí nghiệm, tin học và thư viện – nơi tri thức mở ra.',
    accent: '#0e7490',
    paragraphs: [
      'Dãy chức năng là nơi tập trung phòng thí nghiệm Lý – Hoá – Sinh, phòng tin học, thư viện và phòng y tế. Mỗi lần có tiết thực hành, cả lớp háo hức mang cặp xuống dưới, vừa đi vừa nhắc nhau "đừng làm vỡ ống nghiệm".',
      'Thư viện nhỏ nhưng yên tĩnh, có những buổi trưa ngồi đọc sách mà quên cả giờ vào lớp. Phòng tin học thì luôn là nơi được mong chờ nhất, dù chỉ để gõ vài dòng lệnh hay lén mở một trò chơi nhỏ khi cô không để ý.',
    ],
    highlights: [
      'Tiết thực hành Hoá – Sinh đầy háo hức',
      'Thư viện yên tĩnh những buổi trưa',
      'Phòng tin học và những "bí mật" sau màn hình',
    ],
  },
  day_hieu_bo: {
    tagline: 'Dãy hiệu bộ – nơi thầy cô luôn có một chỗ để quay về.',
    accent: '#7c2d12',
    paragraphs: [
      'Dãy hiệu bộ nằm ở phía bên phải sân trường, gồm phòng hiệu trưởng, phòng giáo viên và văn phòng. Đây là nơi học sinh thường ghé qua để xin giấy xác nhận, nộp đơn, hoặc đơn giản là tìm cô chủ nhiệm hỏi một điều gì đó.',
      'Phòng giáo viên lúc nào cũng có tiếng trò chuyện, tiếng ấm nước sôi và mùi trà thoang thoảng. Mỗi lần bước vào, đứa nào cũng tự động hạ giọng, nhưng thầy cô thì luôn quay ra cười và hỏi: "Có chuyện gì thế em?".',
    ],
    highlights: [
      'Lần đầu vào phòng giáo viên',
      'Xin giấy xác nhận, nộp đơn, gặp cô chủ nhiệm',
      'Ấm trà và nụ cười của thầy cô',
    ],
  },
  hang_cay_trai: {
    tagline: 'Con đường rợp bóng cây bên trái sân trường.',
    accent: '#15803d',
    paragraphs: [
      'Hàng cây bên trái chạy dọc lối đi, tán lá đan vào nhau tạo thành một mái che xanh mát. Buổi sáng, nắng lọt qua kẽ lá thành những đốm sáng nhảy nhót trên vai áo học sinh.',
      'Đây là con đường quen thuộc mỗi sáng đến lớp, là nơi dừng lại trú mưa, là chỗ đứng chờ bạn cùng đi căn tin. Mùa nào cũng có kỷ niệm: mùa hoa, mùa lá rụng, và mùa ve sầu gọi hè đến sớm.',
    ],
    highlights: [
      'Bóng mát trên đường đến lớp',
      'Dừng chân trú mưa bên hàng cây',
      'Mùa lá rụng và tiếng ve gọi hè',
    ],
  },
  hang_cay_phai: {
    tagline: 'Hàng cây bên phải – nơi gió thổi qua và tiếng cười theo về.',
    accent: '#166534',
    paragraphs: [
      'Hàng cây phía bên phải không rộng bằng bên trái nhưng lại là lối đi tắt quen thuộc để ra sân bóng chuyền. Những buổi chiều thể dục, cả lớp kéo nhau qua đây, tiếng dép lê xào xạc trên nền gạch.',
      'Tán cây ở đây thưa hơn nên nắng tràn xuống nhiều hơn, và cũng vì thế mà những buổi chiều ngồi dưới gốc cây lại thấy gió mát lạ thường. Có đứa từng ngồi đây chờ người bạn thân nhất của mình, chỉ để đưa một mẩu giấy nhỏ.',
    ],
    highlights: [
      'Lối tắt ra sân bóng chuyền',
      'Những buổi chiều thể dục rộn ràng',
      'Chờ bạn dưới gốc cây',
    ],
  },
  bang_danh_nhan_trai: {
    tagline: 'Tấm bảng ghi danh những người đã làm rạng danh ngôi trường.',
    accent: '#7e22ce',
    paragraphs: [
      'Bảng danh nhân bên trái nằm dưới tán cây, ghi lại tên tuổi những thầy cô, học sinh ưu tú và những truyền thống tốt đẹp của trường. Mỗi lần đi ngang, ít ai dừng lại đọc kỹ, nhưng ai cũng biết nó ở đó.',
      'Rồi đến một ngày, khi chuẩn bị ra trường, có người mới đứng lại thật lâu trước tấm bảng ấy. Đọc từng dòng chữ nhỏ, tự nhiên thấy tự hào và cũng thấy mình cần cố gắng nhiều hơn để xứng đáng với ngôi trường này.',
    ],
    highlights: [
      'Truyền thống và tên tuổi của trường',
      'Lần đầu dừng lại đọc thật kỹ',
      'Niềm tự hào trước ngày ra trường',
    ],
  },
  bang_danh_nhan_phai: {
    tagline: 'Bảng danh nhân bên phải – lời nhắc nhẹ về những ước mơ.',
    accent: '#9333ea',
    paragraphs: [
      'Đối diện bảng bên trái, bảng danh nhân bên phải ghi những tấm gương học tập và các thế hệ đã trưởng thành từ mái trường này. Với nhiều học sinh, đó là lời nhắc: người đi trước đã làm được, mình cũng có thể.',
      'Giờ ra chơi, có bạn đứng trước bảng, chỉ tay vào một cái tên và nói với bạn mình: "Sau này tao cũng sẽ có tên ở đây". Câu nói ấy có thể chỉ là đùa, nhưng nhiều năm sau nhớ lại, người ta vẫn thấy tim mình ấm lên.',
    ],
    highlights: [
      'Những tấm gương học tập của trường',
      'Ước mơ được ghi tên một lần',
      'Lời hứa đùa của tuổi học trò',
    ],
  },
  san_bong_chuyen: {
    tagline: 'Tiếng bóng nảy, tiếng cổ vũ và những giọt mồ hôi tuổi trẻ.',
    accent: '#c2410c',
    paragraphs: [
      'Sân bóng chuyền nằm ở phía sau dãy học, có lưới căng giữa sân và những vạch kẻ đã mờ dần theo năm tháng. Giờ thể dục, cả lớp chia đội, đứa nào cũng muốn đứng ở vị trí đập bóng để "ghi điểm" trước mặt bạn bè.',
      'Những giải bóng chuyền của trường là dịp cả sân rộn ràng. Tiếng hô "cố lên", tiếng vỗ tay, có cả những pha bóng hụt khiến cả hai đội cười nghiêng ngả. Thắng thua không quan trọng, quan trọng là đã cùng nhau cháy hết mình.',
    ],
    highlights: [
      'Giờ thể dục và những pha bóng hụt',
      'Giải bóng chuyền của trường',
      'Tiếng cổ vũ và những giọt mồ hôi',
    ],
  },
  nha_xe_hs: {
    tagline: 'Nhà xe học sinh – khởi đầu và kết thúc mỗi ngày đến trường.',
    accent: '#0284c7',
    paragraphs: [
      'Mỗi sáng, nhà xe học sinh là nơi đông đúc nhất. Tiếng chuông xe đạp, tiếng dắt xe, tiếng gọi nhau í ới khiến cả khu vực rộn ràng như một phiên chợ nhỏ. Đứa nào tới muộn thì phải dắt xe vào tận trong cùng, rồi chạy thật nhanh lên lớp.',
      'Chiều tan học, nhà xe lại càng náo nhiệt hơn. Có đứa đứng chờ bạn, có đứa loay hoay tìm chìa khoá, có đứa phải dắt bộ vì xe hết hơi. Vậy mà chẳng ai thấy phiền, vì đó là một phần của mỗi ngày đi học.',
    ],
    highlights: [
      'Buổi sáng dắt xe vào trường',
      'Tìm xe, quên chìa khoá và những lần dắt bộ',
      'Chiều tan học náo nhiệt',
    ],
  },
  nha_xe_gv: {
    tagline: 'Khu gửi xe của thầy cô – nhịp sống lặng lẽ của ngôi trường.',
    accent: '#475569',
    paragraphs: [
      'Nhà xe giáo viên nằm ở phía bên kia cổng, yên tĩnh hơn nhiều so với nhà xe học sinh. Sáng sớm, từng chiếc xe máy dựng ngay ngắn, thầy cô bước xuống, chỉnh lại áo và mang theo tập giáo án vào lớp.',
      'Đôi khi học sinh đi ngang qua đây để chào thầy cô. Một câu "Em chào thầy ạ!" vang lên giữa sân trường sớm mai, thầy mỉm cười gật đầu. Những điều nhỏ bé ấy, sau này nhớ lại, hoá ra là cả một bầu trời tuổi học trò.',
    ],
    highlights: [
      'Sáng sớm thầy cô đến trường',
      'Những lời chào giản dị mỗi ngày',
      'Khuôn viên yên tĩnh phía sau cổng',
    ],
  },
  cong_truong: {
    tagline: 'Cánh cổng mở ra một thời thanh xuân.',
    accent: '#1d4ed8',
    paragraphs: [
      'Cổng trường là nơi bắt đầu mọi thứ: ngày đầu tiên bỡ ngỡ đứng chờ mẹ, những buổi sáng vội vàng chạy vào vì suýt muộn học, và cả những chiều tan học chầm chậm bước ra, tiếc nuối một ngày nữa đã qua.',
      'Ngày cuối cấp, cả lớp thường đứng lại trước cổng để chụp một tấm ảnh. Cánh cổng vẫn vậy, vẫn sơn xanh, vẫn có tấm biển ghi tên trường, nhưng người đứng dưới đã khác. Bước qua cánh cổng ấy, chúng ta mang theo cả một thời thanh xuân.',
    ],
    highlights: [
      'Ngày đầu tiên bỡ ngỡ trước cổng trường',
      'Những buổi sáng suýt muộn học',
      'Tấm ảnh ngày cuối cấp trước cổng',
    ],
  },
};

export const FALLBACK_STORY: ZoneStory = {
  tagline: 'Một góc nhỏ của tuổi học trò.',
  accent: '#1d4ed8',
  paragraphs: [
    'Mỗi góc nhỏ trong khuôn viên trường đều giữ lại một mẩu ký ức riêng. Có thể đó là nơi bạn từng đứng chờ bạn thân, từng đọc một trang sách, hay từng ngắm sân trường trong một buổi chiều rất đỗi bình yên.',
    'Hãy chụp lại một tấm ảnh và kể câu chuyện của bạn về nơi này, để những kỷ niệm ấy không bị thời gian cuốn đi.',
  ],
  highlights: [
    'Một kỷ niệm nhỏ của riêng bạn',
    'Một lần dừng lại ngắm sân trường',
    'Một câu chuyện cùng bạn bè',
  ],
};
