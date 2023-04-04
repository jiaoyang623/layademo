#!/usr/bin/python3


class GLBReader:
    def __init__(self, data: bytearray):
        self.data = data
        self.header = {}
        self.content = []
        self.position = 0

    def parse(self):
        self.parse_header()
        self.position = 12
        while self.position < self.header['total_len']:
            self.parse_block(self.position)

    def parse_header(self):
        self.header['magic'] = self.read_str(0, 4)
        self.header['version'] = self.read_int(4)
        self.header['total_len'] = self.read_int(8)
        print(self.header)

    def parse_block(self, offset: int):
        block_len = self.read_int(offset)
        block = {'len': block_len,
                 'type': self.read_str(offset + 4, 4),
                 'content': self.data[offset + 8: offset + 8 + block_len]
                 }
        self.content.append(block)
        self.position = offset + 8 + block_len
        if block['type'] == 'JSON':
            print(block)
        else:
            print(block['len'], block['type'])

    def read_int(self, offset):
        return int.from_bytes(self.data[offset:offset + 4], "little")

    def read_str(self, offset, length):
        return self.data[offset: offset + length].decode("utf-8")


with open('3d/avatar.glb', 'rb') as f:
    data = f.read()

reader = GLBReader(data)
reader.parse()
