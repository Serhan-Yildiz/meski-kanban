import 'package:flutter/material.dart';
import 'package:meski_kanban_mobile/widgets/list_column.dart';
import 'package:meski_kanban_mobile/widgets/custom_input.dart';
import 'package:meski_kanban_mobile/widgets/custom_button.dart';

class BoardScreen extends StatefulWidget {
  final String boardName;

  const BoardScreen({required this.boardName});

  @override
  State<BoardScreen> createState() => _BoardScreenState();
}

class _BoardScreenState extends State<BoardScreen> {
  final listTitleController = TextEditingController();

  List<Map<String, dynamic>> lists = [
    {
      "id": 1,
      "title": "Yapılacaklar",
      "cards": [
        {"id": 1, "title": "API bağlantısı yap"},
        {"id": 2, "title": "Kart detay ekranı tasarla"},
      ],
    },
    {
      "id": 2,
      "title": "Devam Eden",
      "cards": [
        {"id": 3, "title": "Mobil dashboard"},
      ],
    }
  ];

  void handleAddList() {
    final title = listTitleController.text.trim();
    if (title.isEmpty) return;

    setState(() {
      lists.add({
        "id": DateTime.now().millisecondsSinceEpoch,
        "title": title,
        "cards": [],
      });
      listTitleController.clear();
    });
  }

  void handleAddCard(int listId, String cardTitle) {
    setState(() {
      final index = lists.indexWhere((l) => l["id"] == listId);
      if (index != -1) {
        lists[index]["cards"].add({
          "id": DateTime.now().millisecondsSinceEpoch,
          "title": cardTitle,
        });
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.boardName),
        backgroundColor: Color(0xFF006eae),
        foregroundColor: Colors.white,
      ),
      body: Column(
        children: [
          Padding(
            padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
            child: Row(
              children: [
                Expanded(
                  child: CustomInput(
                    controller: listTitleController,
                    hintText: "Yeni liste başlığı",
                  ),
                ),
                SizedBox(width: 8),
                CustomButton(text: "Ekle", onPressed: handleAddList),
              ],
            ),
          ),
          Expanded(
            child: ListView(
              scrollDirection: Axis.horizontal,
              padding: EdgeInsets.all(16),
              children: lists
                  .map(
                    (list) => Padding(
                      padding: const EdgeInsets.only(right: 16.0),
                      child: ListColumn(
                        listTitle: list["title"],
                        cards: list["cards"],
                        onAddCard: (cardTitle) =>
                            handleAddCard(list["id"], cardTitle),
                      ),
                    ),
                  )
                  .toList(),
            ),
          )
        ],
      ),
    );
  }
}
