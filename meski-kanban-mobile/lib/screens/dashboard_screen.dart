import 'package:flutter/material.dart';
import 'package:meski_kanban_mobile/widgets/board_tile.dart';
import 'package:meski_kanban_mobile/widgets/custom_input.dart';
import 'package:meski_kanban_mobile/widgets/custom_button.dart';

class DashboardScreen extends StatefulWidget {
  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  final newBoardController = TextEditingController();
  List<Map<String, dynamic>> boards = [
    {"id": 1, "name": "Proje A"},
    {"id": 2, "name": "MESKİ İçme Suyu"},
  ]; // Mock data, sonra API'den alınacak

  void handleAddBoard() {
    final name = newBoardController.text.trim();
    if (name.isEmpty) return;

    setState(() {
      boards.add({
        "id": DateTime.now().millisecondsSinceEpoch,
        "name": name,
      });
      newBoardController.clear();
    });
  }

  void goToBoard(int boardId) {
    // TODO: board_screen.dart sayfasına yönlendirilecek
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text("Board $boardId sayfasına gidilecek.")),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Board'larım"),
        backgroundColor: Color(0xFF006eae),
        foregroundColor: Colors.white,
      ),
      body: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          children: [
            Row(
              children: [
                Expanded(
                  child: CustomInput(
                    controller: newBoardController,
                    hintText: "Yeni board ismi",
                  ),
                ),
                SizedBox(width: 8),
                CustomButton(text: "Ekle", onPressed: handleAddBoard),
              ],
            ),
            SizedBox(height: 24),
            Expanded(
              child: GridView.count(
                crossAxisCount: 2,
                crossAxisSpacing: 12,
                mainAxisSpacing: 12,
                children: boards
                    .map(
                      (b) => BoardTile(
                        title: b['name'],
                        onTap: () => goToBoard(b['id']),
                      ),
                    )
                    .toList(),
              ),
            )
          ],
        ),
      ),
    );
  }
}
