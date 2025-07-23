import 'package:flutter/material.dart';
import 'package:meski_kanban_mobile/widgets/custom_input.dart';
import 'package:meski_kanban_mobile/widgets/card_box.dart';

class CardDetailScreen extends StatefulWidget {
  final String cardTitle;

  const CardDetailScreen({required this.cardTitle});

  @override
  State<CardDetailScreen> createState() => _CardDetailScreenState();
}

class _CardDetailScreenState extends State<CardDetailScreen> {
  List<String> comments = [
    "Bu kartta backend tamamlandı.",
    "Flutter UI bağlantısı yapılacak.",
  ];

  final commentController = TextEditingController();

  void handleAddComment(String comment) {
    if (comment.trim().isEmpty) return;
    setState(() {
      comments.add(comment);
    });
    commentController.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Kart Detayı"),
        backgroundColor: Color(0xFF006eae),
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              widget.cardTitle,
              style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Color(0xFF006eae)),
            ),
            SizedBox(height: 16),
            Text("Açıklama: (şimdilik örnek) Bu kartın içeriği burada yer alacak."),
            SizedBox(height: 24),
            Text(
              "Yorumlar",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
            ),
            SizedBox(height: 12),
            Expanded(
              child: ListView(
                children: comments.map((comment) {
                  return CardBox(title: comment);
                }).toList(),
              ),
            ),
            SizedBox(height: 12),
            CustomInput(
              controller: commentController,
              hintText: "Yorum ekle ve Enter'a bas",
              onSubmitted: handleAddComment,
            )
          ],
        ),
      ),
    );
  }
}
